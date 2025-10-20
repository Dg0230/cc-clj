/**
 * Shared AWS Smithy context helpers extracted from bundle scaffolding.
 */
// TODO: Port Smithy context wiring from cli-origin.js modules.
export interface SmithyContext {
  readonly namespaces: Record<string, unknown>;
}

export function createSmithyContext(namespaces: Record<string, unknown> = {}): SmithyContext {
  return { namespaces: { ...namespaces } };
}

export const smithyContext = createSmithyContext();
