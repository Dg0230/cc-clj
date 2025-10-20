/**
 * Minimal Commander error implementations staged from bundle module `aC1`.
 *
 * The real logic will be ported from the cli-origin.js bundle; this placeholder
 * only mirrors the exported surface.
 */
export declare class CommanderError extends Error {
    readonly code: string;
    readonly exitCode: number;
    constructor(code: string, exitCode: number, message: string);
}
export declare class InvalidArgumentError extends Error {
    constructor(message: string);
}
export declare function todo(message?: string): never;
