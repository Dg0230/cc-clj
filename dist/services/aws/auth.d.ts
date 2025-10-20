/**
 * Placeholder HTTP auth configuration derived from bundle module `OG0`.
 */
export interface HttpAuthScheme {
    readonly name: string;
    readonly options?: Record<string, unknown>;
}
export declare function defaultBedrockHttpAuthSchemeProvider(): HttpAuthScheme[];
export declare function defaultBedrockHttpAuthSchemeParametersProvider(): Record<string, unknown>;
export declare function resolveHttpAuthSchemeConfig(overrides?: Partial<Record<string, unknown>>): Record<string, unknown>;
