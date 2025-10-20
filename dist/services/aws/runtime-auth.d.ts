/**
 * Placeholder Bedrock runtime auth configuration derived from bundle module `rU0`.
 */
export interface RuntimeHttpAuthScheme {
    readonly name: string;
    readonly runtime: true;
}
export declare function defaultBedrockRuntimeHttpAuthSchemeProvider(): RuntimeHttpAuthScheme[];
export declare function defaultBedrockRuntimeHttpAuthSchemeParametersProvider(): Record<string, unknown>;
export declare function resolveRuntimeHttpAuthSchemeConfig(overrides?: Partial<Record<string, unknown>>): Record<string, unknown>;
