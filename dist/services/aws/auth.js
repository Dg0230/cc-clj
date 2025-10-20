"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultBedrockHttpAuthSchemeProvider = defaultBedrockHttpAuthSchemeProvider;
exports.defaultBedrockHttpAuthSchemeParametersProvider = defaultBedrockHttpAuthSchemeParametersProvider;
exports.resolveHttpAuthSchemeConfig = resolveHttpAuthSchemeConfig;
const context_1 = require("../../shared/aws/context");
function defaultBedrockHttpAuthSchemeProvider() {
    void context_1.smithyContext;
    return [{ name: 'sigv4' }];
}
function defaultBedrockHttpAuthSchemeParametersProvider() {
    return { region: 'us-east-1' };
}
function resolveHttpAuthSchemeConfig(overrides = {}) {
    return {
        ...defaultBedrockHttpAuthSchemeParametersProvider(),
        ...overrides,
    };
}
