/**
 * Placeholder OpenTelemetry API namespaces for tracing, metrics, propagation, and context.
 */
// TODO: Port OpenTelemetry API shim implementations from cli-origin.js bundles.
export const trace = {
  getTracer: (name: string) => ({ name }),
};

export const metrics = {
  getMeter: (name: string) => ({ name }),
};

export const propagation = {
  createBaggage: () => ({}) as Record<string, unknown>,
};

export const context = {
  active: () => ({}),
};
