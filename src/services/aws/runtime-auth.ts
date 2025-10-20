/**
 * Placeholder Bedrock runtime auth configuration derived from bundle module `rU0`.
 */
// TODO(rU0): Port runtime HTTP auth providers from cli-origin.js.
export interface RuntimeHttpAuthScheme {
  readonly name: string;
  readonly runtime: true;
}

export function defaultBedrockRuntimeHttpAuthSchemeProvider(): RuntimeHttpAuthScheme[] {
  return [{ name: 'sigv4a', runtime: true }];
}

export function defaultBedrockRuntimeHttpAuthSchemeParametersProvider(): Record<string, unknown> {
  return { region: 'us-east-1' };
}

export function resolveRuntimeHttpAuthSchemeConfig(overrides: Partial<Record<string, unknown>> = {}): Record<string, unknown> {
  return {
    ...defaultBedrockRuntimeHttpAuthSchemeParametersProvider(),
    ...overrides,
  };
}
