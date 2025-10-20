import { Argument, humanReadableArgName } from './argument';
import { CommanderError, InvalidArgumentError } from '../../shared/cli/errors';
import { Help } from './help';
import { parseTokens, ParseOptionsResult } from './parser';
import { Option } from './option';

/**
 * Minimal Commander `Command` placeholder wired from bundle module `SjQ`.
 */
// TODO(SjQ): Port Command implementation from cli-origin.js.
export interface ParseOptionsSettings {
  from?: 'node' | 'user';
}

export type CommandAction = (thisCommand: Command, ...operands: unknown[]) => unknown | Promise<unknown>;

export class Command {
  private _name = '';
  private _description?: string;
  private _summary?: string;
  private _aliases: string[] = [];
  private _helpFactory: () => Help = () => new Help();
  private _action?: CommandAction;
  private _enablePositionalOptions = false;
  private _storeOptionsAsProperties = true;
  private _passedOptionValues: Record<string, unknown> = {};
  private _processedOperands: unknown[] = [];

  public readonly commands: Command[] = [];
  public readonly options: Option[] = [];
  public readonly arguments: Argument[] = [];

  constructor(name?: string) {
    if (name) {
      this._name = name;
    }
  }

  public name(): string;
  public name(value: string): this;
  public name(value?: string): string | this {
    if (value === undefined) {
      return this._name || this.constructor.name.toLowerCase();
    }
    this._name = value;
    return this;
  }

  public alias(): string;
  public alias(alias: string): this;
  public alias(alias?: string): this | string {
    if (alias === undefined) {
      return this._aliases[0] ?? '';
    }
    if (!this._aliases.includes(alias)) {
      this._aliases.push(alias);
    }
    return this;
  }

  public aliases(): string[] {
    return [...this._aliases];
  }

  public description(): string;
  public description(description: string): this;
  public description(description?: string): string | this {
    if (description === undefined) {
      return this._description ?? '';
    }
    this._description = description;
    return this;
  }

  public summary(): string;
  public summary(summary: string): this;
  public summary(summary?: string): string | this {
    if (summary === undefined) {
      return this._summary ?? this.description();
    }
    this._summary = summary;
    return this;
  }

  public configureHelp(factory: () => Help): this {
    this._helpFactory = factory;
    return this;
  }

  public addCommand(command: Command): this {
    this.commands.push(command);
    return this;
  }

  public command(name: string, description?: string): Command {
    const subcommand = new Command(name);
    if (description) {
      subcommand.description(description);
    }
    this.addCommand(subcommand);
    return subcommand;
  }

  public addOption(option: Option): this {
    this.options.push(option);
    return this;
  }

  public option(flags: string, description?: string, defaultValue?: unknown): this {
    const opt = new Option(flags, description);
    if (defaultValue !== undefined) {
      opt.default(defaultValue);
    }
    this.addOption(opt);
    return this;
  }

  public requiredOption(flags: string, description?: string, defaultValue?: unknown): this {
    const opt = new Option(flags, description).makeOptionMandatory(true);
    if (defaultValue !== undefined) {
      opt.default(defaultValue);
    }
    this.addOption(opt);
    return this;
  }

  public addArgument(argument: Argument): this {
    this.arguments.push(argument);
    return this;
  }

  public argument(name: string, description?: string): this {
    const arg = new Argument(name, description);
    this.addArgument(arg);
    return this;
  }

  public allowUnknownOption(allow = true): this {
    this._allowUnknown = allow;
    return this;
  }

  public enablePositionalOptions(enable = true): this {
    this._enablePositionalOptions = enable;
    return this;
  }

  public storeOptionsAsProperties(store = true): this {
    this._storeOptionsAsProperties = store;
    return this;
  }

  public action(fn: CommandAction): this {
    this._action = fn;
    return this;
  }

  public async parseAsync(argv: readonly string[], settings: ParseOptionsSettings = {}): Promise<this> {
    await this.executeParse(argv, settings);
    return this;
  }

  public parse(argv: readonly string[], settings: ParseOptionsSettings = {}): this {
    void this.executeParse(argv, settings);
    return this;
  }

  public opts<T extends Record<string, unknown> = Record<string, unknown>>(): T {
    return (this._passedOptionValues as T) ?? ({} as T);
  }

  public processedArgs(): unknown[] {
    return [...this._processedOperands];
  }

  public helpInformation(): string {
    const help = this._helpFactory();
    return help.formatHelp(this);
  }

  public outputHelp(): string {
    const information = this.helpInformation();
    // eslint-disable-next-line no-console -- Placeholder implementation.
    console.log(information);
    return information;
  }

  private async executeParse(argv: readonly string[], settings: ParseOptionsSettings): Promise<void> {
    const tokens = this.prepareTokens(argv, settings.from);
    const result = this.applyOptions(tokens);
    this._passedOptionValues = this.applyOptionDefaults(result);
    this._processedOperands = this.processArguments(result.operands);

    if (!this._allowUnknown && result.unknown.length > 0) {
      throw new CommanderError('commander.unknownOption', 1, `Unknown options: ${result.unknown.join(', ')}`);
    }

    if (this._storeOptionsAsProperties) {
      for (const [key, value] of Object.entries(this._passedOptionValues)) {
        (this as Record<string, unknown>)[key] = value;
      }
    }

    if (this._action) {
      const maybePromise = this._action(this, ...this._processedOperands);
      if (maybePromise instanceof Promise) {
        await maybePromise;
      }
    }
  }

  private prepareTokens(argv: readonly string[], from: ParseOptionsSettings['from'] = 'node'): string[] {
    if (from === 'user') {
      return [...argv];
    }
    if (argv.length <= 2) {
      return [];
    }
    return argv.slice(2);
  }

  private applyOptions(tokens: string[]): ParseOptionsResult {
    return parseTokens(tokens, this.options, this._allowUnknown || this._enablePositionalOptions);
  }

  private applyOptionDefaults(result: ParseOptionsResult): Record<string, unknown> {
    const values: Record<string, unknown> = { ...result.optionValues };

    for (const option of this.options) {
      const attribute = option.attributeName();
      const existing = values[attribute];
      if (existing === undefined) {
        const defaultValue = option.defaultValue;
        if (defaultValue !== undefined) {
          values[attribute] = defaultValue;
        } else if (option.isMandatory()) {
          throw new CommanderError(
            'commander.missingMandatoryOptionValue',
            1,
            `Required option not specified: ${option.flags}`,
          );
        }
      }
    }

    return values;
  }

  private processArguments(operands: readonly string[]): unknown[] {
    const remaining = [...operands];
    const processed: unknown[] = [];
    const missing: string[] = [];

    for (const argument of this.arguments) {
      if (argument.isVariadic()) {
        const values = remaining.splice(0);
        if (values.length === 0) {
          if (argument.isRequired()) {
            missing.push(humanReadableArgName(argument));
          } else if (argument.defaultValue !== undefined) {
            processed.push(argument.defaultValue);
          } else {
            processed.push([]);
          }
        } else {
          const parsedValues = values.map((value) => argument.parse(value));
          processed.push(parsedValues);
        }
        continue;
      }

      const value = remaining.shift();
      if (value === undefined) {
        if (argument.isRequired()) {
          missing.push(humanReadableArgName(argument));
        } else if (argument.defaultValue !== undefined) {
          processed.push(argument.defaultValue);
        } else {
          processed.push(undefined);
        }
        continue;
      }

      processed.push(argument.parse(value));
    }

    if (missing.length > 0) {
      throw new InvalidArgumentError(`Missing required arguments: ${missing.join(', ')}`);
    }

    return [...processed, ...remaining];
  }

  private get _allowUnknown(): boolean {
    return this._allowUnknownOption;
  }

  private set _allowUnknown(value: boolean) {
    this._allowUnknownOption = value;
  }

  private _allowUnknownOption = false;
}
