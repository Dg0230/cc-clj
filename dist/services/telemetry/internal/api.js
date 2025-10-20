"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.context = exports.propagation = exports.metrics = exports.trace = void 0;
/**
 * Placeholder OpenTelemetry API namespaces for tracing, metrics, propagation, and context.
 */
// TODO: Port OpenTelemetry API shim implementations from cli-origin.js bundles.
exports.trace = {
    getTracer: (name) => ({ name }),
};
exports.metrics = {
    getMeter: (name) => ({ name }),
};
exports.propagation = {
    createBaggage: () => ({}),
};
exports.context = {
    active: () => ({}),
};
