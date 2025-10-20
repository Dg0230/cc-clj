/**
 * Placeholder for the Commander `Option` implementation (bundle module `vs0`).
 */
export type OptionParser<T> = (value: string, previous?: T) => T;
export declare class Option<T = unknown> {
    readonly flags: string;
    readonly short?: string;
    readonly long?: string;
    description?: string;
    private _mandatory;
    private _variadic;
    private _defaultValue?;
    private _parser?;
    private _choices?;
    constructor(flags: string, description?: string);
    attributeName(): string;
    isMandatory(): boolean;
    isVariadic(): boolean;
    makeOptionMandatory(mandatory?: boolean): this;
    default(value: T | (() => T)): this;
    argParser(parser: OptionParser<T>): this;
    choices(values: readonly T[]): this;
    get defaultValue(): T | undefined;
    parse(value: string, previous?: T): T;
}
export declare class DualOptions {
    readonly positive: Option;
    readonly negative: Option;
    constructor(positive: Option, negative: Option);
    all(): Option[];
}
