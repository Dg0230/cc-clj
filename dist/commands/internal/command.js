"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = void 0;
const argument_1 = require("./argument");
const errors_1 = require("../../shared/cli/errors");
const help_1 = require("./help");
const parser_1 = require("./parser");
const option_1 = require("./option");
class Command {
    constructor(name) {
        this._name = '';
        this._aliases = [];
        this._helpFactory = () => new help_1.Help();
        this._enablePositionalOptions = false;
        this._storeOptionsAsProperties = true;
        this._passedOptionValues = {};
        this._processedOperands = [];
        this.commands = [];
        this.options = [];
        this.arguments = [];
        this._allowUnknownOption = false;
        if (name) {
            this._name = name;
        }
    }
    name(value) {
        if (value === undefined) {
            return this._name || this.constructor.name.toLowerCase();
        }
        this._name = value;
        return this;
    }
    alias(alias) {
        var _a;
        if (alias === undefined) {
            return (_a = this._aliases[0]) !== null && _a !== void 0 ? _a : '';
        }
        if (!this._aliases.includes(alias)) {
            this._aliases.push(alias);
        }
        return this;
    }
    aliases() {
        return [...this._aliases];
    }
    description(description) {
        var _a;
        if (description === undefined) {
            return (_a = this._description) !== null && _a !== void 0 ? _a : '';
        }
        this._description = description;
        return this;
    }
    summary(summary) {
        var _a;
        if (summary === undefined) {
            return (_a = this._summary) !== null && _a !== void 0 ? _a : this.description();
        }
        this._summary = summary;
        return this;
    }
    configureHelp(factory) {
        this._helpFactory = factory;
        return this;
    }
    addCommand(command) {
        this.commands.push(command);
        return this;
    }
    command(name, description) {
        const subcommand = new Command(name);
        if (description) {
            subcommand.description(description);
        }
        this.addCommand(subcommand);
        return subcommand;
    }
    addOption(option) {
        this.options.push(option);
        return this;
    }
    option(flags, description, defaultValue) {
        const opt = new option_1.Option(flags, description);
        if (defaultValue !== undefined) {
            opt.default(defaultValue);
        }
        this.addOption(opt);
        return this;
    }
    requiredOption(flags, description, defaultValue) {
        const opt = new option_1.Option(flags, description).makeOptionMandatory(true);
        if (defaultValue !== undefined) {
            opt.default(defaultValue);
        }
        this.addOption(opt);
        return this;
    }
    addArgument(argument) {
        this.arguments.push(argument);
        return this;
    }
    argument(name, description) {
        const arg = new argument_1.Argument(name, description);
        this.addArgument(arg);
        return this;
    }
    allowUnknownOption(allow = true) {
        this._allowUnknown = allow;
        return this;
    }
    enablePositionalOptions(enable = true) {
        this._enablePositionalOptions = enable;
        return this;
    }
    storeOptionsAsProperties(store = true) {
        this._storeOptionsAsProperties = store;
        return this;
    }
    action(fn) {
        this._action = fn;
        return this;
    }
    async parseAsync(argv, settings = {}) {
        await this.executeParse(argv, settings);
        return this;
    }
    parse(argv, settings = {}) {
        void this.executeParse(argv, settings);
        return this;
    }
    opts() {
        var _a;
        return (_a = this._passedOptionValues) !== null && _a !== void 0 ? _a : {};
    }
    processedArgs() {
        return [...this._processedOperands];
    }
    helpInformation() {
        const help = this._helpFactory();
        return help.formatHelp(this);
    }
    outputHelp() {
        const information = this.helpInformation();
        // eslint-disable-next-line no-console -- Placeholder implementation.
        console.log(information);
        return information;
    }
    async executeParse(argv, settings) {
        const tokens = this.prepareTokens(argv, settings.from);
        const result = this.applyOptions(tokens);
        this._passedOptionValues = result.optionValues;
        this._processedOperands = result.operands;
        if (this.arguments.length > result.operands.length) {
            const missing = this.arguments.slice(result.operands.length);
            const missingNames = missing.map((arg) => arg.name()).join(', ');
            throw new errors_1.InvalidArgumentError(`Missing required arguments: ${missingNames}`);
        }
        if (!this._allowUnknown && result.unknown.length > 0) {
            throw new errors_1.CommanderError('commander.unknownOption', 1, `Unknown options: ${result.unknown.join(', ')}`);
        }
        if (this._action) {
            const maybePromise = this._action(this, ...result.operands);
            if (maybePromise instanceof Promise) {
                await maybePromise;
            }
        }
    }
    prepareTokens(argv, from = 'node') {
        if (from === 'user') {
            return [...argv];
        }
        if (argv.length <= 2) {
            return [];
        }
        return argv.slice(2);
    }
    applyOptions(tokens) {
        return (0, parser_1.parseTokens)(tokens, this.options, this._allowUnknown || this._enablePositionalOptions);
    }
    get _allowUnknown() {
        return this._allowUnknownOption;
    }
    set _allowUnknown(value) {
        this._allowUnknownOption = value;
    }
}
exports.Command = Command;
