import { smithyContext } from '../../shared/aws/context';

/**
 * Placeholder HTTP auth configuration derived from bundle module `OG0`.
 */
// TODO(OG0): Port Smithy auth providers from cli-origin.js.
export interface HttpAuthScheme {
  readonly name: string;
  readonly options?: Record<string, unknown>;
}

export function defaultBedrockHttpAuthSchemeProvider(): HttpAuthScheme[] {
  void smithyContext;
  return [{ name: 'sigv4' }];
}

export function defaultBedrockHttpAuthSchemeParametersProvider(): Record<string, unknown> {
  return { region: 'us-east-1' };
}

export function resolveHttpAuthSchemeConfig(overrides: Partial<Record<string, unknown>> = {}): Record<string, unknown> {
  return {
    ...defaultBedrockHttpAuthSchemeParametersProvider(),
    ...overrides,
  };
}
