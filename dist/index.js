#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceContainer = exports.RuntimeService = exports.HttpClientService = exports.TelemetryService = exports.ConfigurationService = void 0;
exports.bootstrapServices = bootstrapServices;
exports.main = main;
const commander_1 = require("./commands/commander");
const option_1 = require("./commands/option");
class ConfigurationService {
    constructor() {
        this.defaultProfile = 'default';
        this.defaultTarget = 'workspace';
        this.telemetryEnabled = true;
        this.endpoint = 'https://service.invalid';
    }
}
exports.ConfigurationService = ConfigurationService;
class TelemetryService {
    constructor(config) {
        this.config = config;
        this.events = [];
    }
    log(event) {
        if (!this.config.telemetryEnabled) {
            return;
        }
        this.events.push(event);
    }
}
exports.TelemetryService = TelemetryService;
class HttpClientService {
    constructor(config) {
        this.config = config;
        this.requests = [];
    }
    send(command, payload) {
        const url = `${this.config.endpoint.replace(/\/$/, '')}/commands/${command}`;
        this.requests.push({ url, payload });
    }
}
exports.HttpClientService = HttpClientService;
class RuntimeService {
    constructor(telemetry, httpClient) {
        this.telemetry = telemetry;
        this.httpClient = httpClient;
        this.executions = [];
    }
    record(execution) {
        this.executions.push(execution);
        this.telemetry.log(`command.${execution.command}`);
        this.httpClient.send(execution.command, execution);
    }
}
exports.RuntimeService = RuntimeService;
class ServiceContainer {
    constructor(definitions) {
        this.definitions = new Map();
        this.services = new Map();
        this.initializing = new Set();
        this._initializationOrder = [];
        this.order = definitions.map((definition) => definition.name);
        for (const definition of definitions) {
            this.definitions.set(definition.name, definition);
        }
    }
    async initializeAll() {
        for (const name of this.order) {
            await this.resolve(name);
        }
    }
    async resolve(name) {
        var _a;
        if (this.services.has(name)) {
            return this.services.get(name);
        }
        const definition = this.definitions.get(name);
        if (!definition) {
            throw new Error(`Unknown service '${name}'.`);
        }
        if (this.initializing.has(name)) {
            throw new Error(`Circular dependency detected while initializing '${name}'.`);
        }
        this.initializing.add(name);
        for (const dependency of (_a = definition.dependsOn) !== null && _a !== void 0 ? _a : []) {
            await this.resolve(dependency);
        }
        const instance = await definition.factory(this);
        this.services.set(name, instance);
        this.initializing.delete(name);
        this._initializationOrder.push(name);
        return instance;
    }
    get(name) {
        if (!this.services.has(name)) {
            throw new Error(`Service '${name}' has not been initialized.`);
        }
        return this.services.get(name);
    }
    get initializationOrder() {
        return [...this._initializationOrder];
    }
}
exports.ServiceContainer = ServiceContainer;
function createServiceDefinitions() {
    return [
        {
            name: 'config',
            factory: () => new ConfigurationService(),
        },
        {
            name: 'telemetry',
            dependsOn: ['config'],
            factory: (container) => {
                const config = container.get('config');
                return new TelemetryService(config);
            },
        },
        {
            name: 'httpClient',
            dependsOn: ['config'],
            factory: (container) => {
                const config = container.get('config');
                return new HttpClientService(config);
            },
        },
        {
            name: 'runtime',
            dependsOn: ['telemetry', 'httpClient'],
            factory: (container) => {
                const telemetry = container.get('telemetry');
                const httpClient = container.get('httpClient');
                return new RuntimeService(telemetry, httpClient);
            },
        },
    ];
}
function buildProgram(container) {
    const config = container.get('config');
    const command = (0, commander_1.createCommand)('cc-clj');
    command
        .description('Analyze bundled CLI modules and staging progress.')
        .argument('<command>', 'Command to execute')
        .configureHelp(() => ({
        formatHelp: (cmd) => {
            const lines = [
                `Usage: ${cmd.name()} <command> [options]`,
                '',
                cmd.description(),
                '',
                'Options:',
                '  -p, --profile <profile>  Analysis profile name',
                '  -u, --uppercase          Uppercase the resolved target',
                '  --target <value>         Target identifier override',
            ];
            return lines.join('\n');
        },
    }));
    const profileOption = new option_1.Option('-p, --profile <profile>', 'Analysis profile name').default(config.defaultProfile);
    const uppercaseOption = new option_1.Option('-u, --uppercase', 'Uppercase the resolved target')
        .argParser(() => true)
        .default(false);
    const targetOption = new option_1.Option('--target <value>', 'Target identifier override');
    command.addOption(profileOption);
    command.addOption(uppercaseOption);
    command.addOption(targetOption);
    command.action((thisCommand) => {
        var _a, _b, _c, _d, _e, _f;
        const runtime = container.get('runtime');
        const options = thisCommand.opts();
        const processedArgs = thisCommand.processedArgs();
        const [commandName, operandTarget] = processedArgs;
        const providedTarget = ((_b = (_a = options.target) !== null && _a !== void 0 ? _a : operandTarget) !== null && _b !== void 0 ? _b : config.defaultTarget);
        const profileDefault = ((_c = profileOption.defaultValue) !== null && _c !== void 0 ? _c : config.defaultProfile);
        const profile = ((_d = options.profile) !== null && _d !== void 0 ? _d : profileDefault);
        const uppercaseDefault = ((_e = uppercaseOption.defaultValue) !== null && _e !== void 0 ? _e : false);
        const uppercase = Boolean((_f = options.uppercase) !== null && _f !== void 0 ? _f : uppercaseDefault);
        const finalTarget = uppercase ? providedTarget.toUpperCase() : providedTarget;
        runtime.record({
            command: commandName,
            target: finalTarget,
            options: {
                profile,
                uppercase,
                target: providedTarget,
            },
        });
    });
    return command;
}
async function bootstrapServices() {
    const container = new ServiceContainer(createServiceDefinitions());
    await container.initializeAll();
    return container;
}
async function main(argv = process.argv) {
    const services = await bootstrapServices();
    const cli = buildProgram(services);
    await cli.parseAsync(argv);
    return { program: cli, services };
}
if (require.main === module) {
    void main();
}
