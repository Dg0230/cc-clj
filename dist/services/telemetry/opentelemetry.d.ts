import { registerGlobal, getGlobal, unregisterGlobal } from './internal/global';
/**
 * OpenTelemetry shim facade aligning with bundle exports.
 */
export { registerGlobal, getGlobal, unregisterGlobal };
export declare const api: {
    diag: import("./internal/diag").DiagLogger;
    trace: {
        getTracer: (name: string) => {
            name: string;
        };
    };
    metrics: {
        getMeter: (name: string) => {
            name: string;
        };
    };
    propagation: {
        createBaggage: () => Record<string, unknown>;
    };
    context: {
        active: () => {};
    };
};
