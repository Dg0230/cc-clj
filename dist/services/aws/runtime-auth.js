"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultBedrockRuntimeHttpAuthSchemeProvider = defaultBedrockRuntimeHttpAuthSchemeProvider;
exports.defaultBedrockRuntimeHttpAuthSchemeParametersProvider = defaultBedrockRuntimeHttpAuthSchemeParametersProvider;
exports.resolveRuntimeHttpAuthSchemeConfig = resolveRuntimeHttpAuthSchemeConfig;
function defaultBedrockRuntimeHttpAuthSchemeProvider() {
    return [{ name: 'sigv4a', runtime: true }];
}
function defaultBedrockRuntimeHttpAuthSchemeParametersProvider() {
    return { region: 'us-east-1' };
}
function resolveRuntimeHttpAuthSchemeConfig(overrides = {}) {
    return {
        ...defaultBedrockRuntimeHttpAuthSchemeParametersProvider(),
        ...overrides,
    };
}
