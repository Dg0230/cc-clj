/**
 * Minimal gaxios client placeholder.
 */
export interface GaxiosOptions {
    readonly url: string;
    readonly method?: string;
    readonly data?: unknown;
}
export declare const GAXIOS_ERROR_SYMBOL: unique symbol;
export declare class GaxiosError extends Error {
    readonly config: GaxiosOptions;
    readonly [GAXIOS_ERROR_SYMBOL] = true;
    constructor(message: string, config: GaxiosOptions);
}
export declare function defaultErrorRedactor(error: unknown): unknown;
export declare class Gaxios {
    static readonly instance: Gaxios;
    request<T = unknown>(options: GaxiosOptions): Promise<T>;
}
