#!/usr/bin/env node

import { Command, Option, createCommand } from './commands/commander';
import {
  analyzeAndWrite,
  DEFAULT_ANALYSIS_OUTPUT_PATH,
  DEFAULT_BUNDLE_PATH,
  type ModuleAnalysisOptions,
} from './modules/analyzeModules';
import {
  categorizeModules,
  DEFAULT_CATEGORY_OUTPUT_PATH,
  DEFAULT_CATEGORIZE_ANALYSIS_PATH,
} from './modules/categorizeModules';
import { summarizeModules, DEFAULT_SUMMARY_ANALYSIS_PATH } from './modules/summarizeModules';

declare const process: { argv: string[] };
declare const require: {
  (id: string): unknown;
  main?: unknown;
};
declare const module: unknown;

export interface ExecutionRecord {
  command: string;
  target: string;
  options: {
    profile: string;
    uppercase: boolean;
  } & Record<string, unknown>;
  result?: unknown;
}

export interface AppConfiguration {
  readonly defaultProfile: string;
  readonly defaultTarget: string;
  readonly telemetryEnabled: boolean;
  readonly endpoint: string;
}

export class ConfigurationService implements AppConfiguration {
  public readonly defaultProfile: string;
  public readonly defaultTarget: string;
  public readonly telemetryEnabled: boolean;
  public readonly endpoint: string;

  constructor() {
    this.defaultProfile = 'default';
    this.defaultTarget = 'workspace';
    this.telemetryEnabled = true;
    this.endpoint = 'https://service.invalid';
  }
}

export class TelemetryService {
  public readonly events: string[] = [];

  constructor(private readonly config: AppConfiguration) {}

  public log(event: string): void {
    if (!this.config.telemetryEnabled) {
      return;
    }
    this.events.push(event);
  }
}

export interface HttpRequestRecord {
  readonly url: string;
  readonly payload: unknown;
}

export class HttpClientService {
  public readonly requests: HttpRequestRecord[] = [];

  constructor(private readonly config: AppConfiguration) {}

  public send(command: string, payload: unknown): void {
    const url = `${this.config.endpoint.replace(/\/$/, '')}/commands/${command}`;
    this.requests.push({ url, payload });
  }
}

export class RuntimeService {
  public readonly executions: ExecutionRecord[] = [];

  constructor(
    private readonly telemetry: TelemetryService,
    private readonly httpClient: HttpClientService,
  ) {}

  public record(execution: ExecutionRecord): ExecutionRecord {
    this.executions.push(execution);
    this.telemetry.log(`command.${execution.command}`);
    this.httpClient.send(execution.command, execution);
    return execution;
  }
}

type ServiceFactory<T> = (container: ServiceContainer) => T | Promise<T>;

interface ServiceDefinition<T = unknown> {
  readonly name: string;
  readonly dependsOn?: readonly string[];
  readonly factory: ServiceFactory<T>;
}

export class ServiceContainer {
  private readonly definitions = new Map<string, ServiceDefinition>();
  private readonly order: readonly string[];
  private readonly services = new Map<string, unknown>();
  private readonly initializing = new Set<string>();
  private readonly _initializationOrder: string[] = [];

  constructor(definitions: readonly ServiceDefinition[]) {
    this.order = definitions.map((definition) => definition.name);
    for (const definition of definitions) {
      this.definitions.set(definition.name, definition);
    }
  }

  public async initializeAll(): Promise<void> {
    for (const name of this.order) {
      await this.resolve(name);
    }
  }

  public async resolve<T = unknown>(name: string): Promise<T> {
    if (this.services.has(name)) {
      return this.services.get(name) as T;
    }
    const definition = this.definitions.get(name);
    if (!definition) {
      throw new Error(`Unknown service '${name}'.`);
    }
    if (this.initializing.has(name)) {
      throw new Error(`Circular dependency detected while initializing '${name}'.`);
    }
    this.initializing.add(name);
    for (const dependency of definition.dependsOn ?? []) {
      await this.resolve(dependency);
    }
    const instance = await definition.factory(this);
    this.services.set(name, instance);
    this.initializing.delete(name);
    this._initializationOrder.push(name);
    return instance as T;
  }

  public get<T = unknown>(name: string): T {
    if (!this.services.has(name)) {
      throw new Error(`Service '${name}' has not been initialized.`);
    }
    return this.services.get(name) as T;
  }

  public get initializationOrder(): readonly string[] {
    return [...this._initializationOrder];
  }
}

function createServiceDefinitions(): ServiceDefinition[] {
  return [
    {
      name: 'config',
      factory: () => new ConfigurationService(),
    },
    {
      name: 'telemetry',
      dependsOn: ['config'],
      factory: (container) => {
        const config = container.get<AppConfiguration>('config');
        return new TelemetryService(config);
      },
    },
    {
      name: 'httpClient',
      dependsOn: ['config'],
      factory: (container) => {
        const config = container.get<AppConfiguration>('config');
        return new HttpClientService(config);
      },
    },
    {
      name: 'runtime',
      dependsOn: ['telemetry', 'httpClient'],
      factory: (container) => {
        const telemetry = container.get<TelemetryService>('telemetry');
        const httpClient = container.get<HttpClientService>('httpClient');
        return new RuntimeService(telemetry, httpClient);
      },
    },
  ];
}

function buildProgram(container: ServiceContainer): Command {
  const config = container.get<AppConfiguration>('config');
  const command = createCommand('cc-clj');

  command
    .description('Analyze bundled CLI modules and staging progress.')
    .argument('<command>', 'Command to execute (analyze|categorize|summarize|legacy)')
    .argument('[operand]', 'Optional operand for the selected command')
    .configureHelp(() => ({
      formatHelp: (cmd: Command) => {
        const lines = [
          `Usage: ${cmd.name()} <command> [operand] [options]`,
          '',
          cmd.description(),
          '',
          'Options:',
          '  -p, --profile <profile>  Analysis profile name',
          '  -u, --uppercase          Uppercase the resolved target',
          '  --target <value>         Target identifier override',
          `  --bundle <path>          CLI bundle path (default: ${DEFAULT_BUNDLE_PATH})`,
          `  --analysis <path>        Module analysis path (default: ${DEFAULT_CATEGORIZE_ANALYSIS_PATH})`,
          '  -o, --output <path>      Output path override for analyze/categorize commands',
          '  --print                  Print command result to stdout',
        ];
        return lines.join('\n');
      },
    } as unknown as any));

  const profileOption = new Option('-p, --profile <profile>', 'Analysis profile name').default(
    config.defaultProfile,
  );
  const uppercaseOption = new Option('-u, --uppercase', 'Uppercase the resolved target')
    .argParser(() => true)
    .default(false);
  const targetOption = new Option('--target <value>', 'Target identifier override');
  const bundleOption = new Option('--bundle <path>', 'CLI bundle path to analyze').default(DEFAULT_BUNDLE_PATH);
  const analysisOption = new Option('--analysis <path>', 'Existing module analysis path').default(
    DEFAULT_CATEGORIZE_ANALYSIS_PATH,
  );
  const outputOption = new Option('-o, --output <path>', 'Output path for generated files');
  const printOption = new Option('--print', 'Print command result to stdout').argParser(() => true).default(false);

  command.addOption(profileOption);
  command.addOption(uppercaseOption);
  command.addOption(targetOption);
  command.addOption(bundleOption);
  command.addOption(analysisOption);
  command.addOption(outputOption);
  command.addOption(printOption);

  command.action((thisCommand) => {
    const runtime = container.get<RuntimeService>('runtime');
    const options = thisCommand.opts<{
      profile?: string;
      uppercase?: boolean;
      target?: string;
      bundle?: string;
      analysis?: string;
      output?: string;
      print?: boolean;
    }>();

    const processedArgs = thisCommand.processedArgs() as string[];
    const [commandName, operandTarget] = processedArgs;
    const providedTarget = (options.target ?? operandTarget ?? config.defaultTarget) as string;
    const profileDefault = (profileOption.defaultValue ?? config.defaultProfile) as string;
    const profile = (options.profile ?? profileDefault) as string;
    const uppercaseDefault = (uppercaseOption.defaultValue ?? false) as boolean;
    const uppercase = Boolean(options.uppercase ?? uppercaseDefault);
    let finalTarget = uppercase ? providedTarget.toUpperCase() : providedTarget;
    let result: unknown;

    if (!commandName) {
      throw new Error('No command provided.');
    }

    if (commandName === 'analyze') {
      const bundlePath = (operandTarget ?? options.bundle ?? DEFAULT_BUNDLE_PATH) as string;
      const outputPath = (options.output ?? DEFAULT_ANALYSIS_OUTPUT_PATH) as string;
      const analysisOptions: ModuleAnalysisOptions = {
        bundlePath,
        analysisOutputPath: outputPath,
      };
      const analysis = analyzeAndWrite(analysisOptions);
      finalTarget = uppercase ? outputPath.toUpperCase() : outputPath;
      result = analysis;
      if (options.print) {
        // eslint-disable-next-line no-console -- CLI output
        console.log(`Analysis written to ${analysis.outputPath}`);
      }
    } else if (commandName === 'categorize') {
      const analysisPath = (operandTarget ?? options.analysis ?? DEFAULT_CATEGORIZE_ANALYSIS_PATH) as string;
      const outputPath = (options.output ?? DEFAULT_CATEGORY_OUTPUT_PATH) as string;
      const output = categorizeModules({ analysisPath, outputPath });
      finalTarget = uppercase ? outputPath.toUpperCase() : outputPath;
      result = output;
      if (options.print) {
        // eslint-disable-next-line no-console -- CLI output
        console.log(`Categorized ${output.categories.length} categories to ${outputPath}`);
      }
    } else if (commandName === 'summarize') {
      const analysisPath = (operandTarget ?? options.analysis ?? DEFAULT_SUMMARY_ANALYSIS_PATH) as string;
      const summary = summarizeModules({ analysisPath });
      finalTarget = uppercase ? analysisPath.toUpperCase() : analysisPath;
      result = summary;
      if (options.print) {
        // eslint-disable-next-line no-console -- CLI output
        console.log(JSON.stringify(summary, null, 2));
      }
    } else if (commandName === 'legacy') {
      finalTarget = uppercase ? DEFAULT_BUNDLE_PATH.toUpperCase() : DEFAULT_BUNDLE_PATH;
      result = { legacyPath: DEFAULT_BUNDLE_PATH };
      if (options.print) {
        // eslint-disable-next-line no-console -- CLI output
        console.log(DEFAULT_BUNDLE_PATH);
      }
    }

    runtime.record({
      command: commandName,
      target: finalTarget,
      options: {
        profile,
        uppercase,
        target: providedTarget,
        bundle: options.bundle,
        analysis: options.analysis,
        output: options.output,
        print: options.print,
      },
      result,
    });
  });

  return command;
}

export interface MainResult {
  program: Command;
  services: ServiceContainer;
}

export async function bootstrapServices(): Promise<ServiceContainer> {
  const container = new ServiceContainer(createServiceDefinitions());
  await container.initializeAll();
  return container;
}

export async function main(argv: readonly string[] = process.argv): Promise<MainResult> {
  const services = await bootstrapServices();
  const cli = buildProgram(services);
  await cli.parseAsync(argv);
  return { program: cli, services };
}

if (require.main === module) {
  void main();
}
