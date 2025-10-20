/**
 * Placeholder for the Commander `Argument` implementation (bundle module `He1`).
 */
export type ArgumentParser<T> = (value: string, previous?: T) => T;
export declare class Argument<T = unknown> {
    private readonly _rawName;
    private readonly _required;
    private readonly _variadic;
    private _description?;
    private _defaultValue?;
    private _parser?;
    private _choices?;
    constructor(name: string, description?: string);
    name(): string;
    isRequired(): boolean;
    isOptional(): boolean;
    isVariadic(): boolean;
    description(description?: string): string | this;
    default(value: T | (() => T)): this;
    argParser(parser: ArgumentParser<T>): this;
    choices(values: readonly T[]): this;
    parse(value: string, previous?: T): T;
    get defaultValue(): T | undefined;
}
export declare function argument<T = unknown>(name: string, description?: string): Argument<T>;
export declare function humanReadableArgName(arg: Argument): string;
