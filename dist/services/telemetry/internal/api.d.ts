/**
 * Placeholder OpenTelemetry API namespaces for tracing, metrics, propagation, and context.
 */
export declare const trace: {
    getTracer: (name: string) => {
        name: string;
    };
};
export declare const metrics: {
    getMeter: (name: string) => {
        name: string;
    };
};
export declare const propagation: {
    createBaggage: () => Record<string, unknown>;
};
export declare const context: {
    active: () => {};
};
