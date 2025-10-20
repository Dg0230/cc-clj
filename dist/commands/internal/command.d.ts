import { Argument } from './argument';
import { Help } from './help';
import { Option } from './option';
/**
 * Minimal Commander `Command` placeholder wired from bundle module `SjQ`.
 */
export interface ParseOptionsSettings {
    from?: 'node' | 'user';
}
export type CommandAction = (thisCommand: Command, ...operands: unknown[]) => unknown | Promise<unknown>;
export declare class Command {
    private _name;
    private _description?;
    private _summary?;
    private _aliases;
    private _helpFactory;
    private _action?;
    private _enablePositionalOptions;
    private _storeOptionsAsProperties;
    private _passedOptionValues;
    private _processedOperands;
    readonly commands: Command[];
    readonly options: Option[];
    readonly arguments: Argument[];
    constructor(name?: string);
    name(): string;
    name(value: string): this;
    alias(): string;
    alias(alias: string): this;
    aliases(): string[];
    description(): string;
    description(description: string): this;
    summary(): string;
    summary(summary: string): this;
    configureHelp(factory: () => Help): this;
    addCommand(command: Command): this;
    command(name: string, description?: string): Command;
    addOption(option: Option): this;
    option(flags: string, description?: string, defaultValue?: unknown): this;
    requiredOption(flags: string, description?: string, defaultValue?: unknown): this;
    addArgument(argument: Argument): this;
    argument(name: string, description?: string): this;
    allowUnknownOption(allow?: boolean): this;
    enablePositionalOptions(enable?: boolean): this;
    storeOptionsAsProperties(store?: boolean): this;
    action(fn: CommandAction): this;
    parseAsync(argv: readonly string[], settings?: ParseOptionsSettings): Promise<this>;
    parse(argv: readonly string[], settings?: ParseOptionsSettings): this;
    opts<T extends Record<string, unknown> = Record<string, unknown>>(): T;
    processedArgs(): unknown[];
    helpInformation(): string;
    outputHelp(): string;
    private executeParse;
    private prepareTokens;
    private applyOptions;
    private applyOptionDefaults;
    private processArguments;
    private get _allowUnknown();
    private set _allowUnknown(value);
    private _allowUnknownOption;
}
