"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerGlobal = registerGlobal;
exports.getGlobal = getGlobal;
exports.unregisterGlobal = unregisterGlobal;
/**
 * Global registration helpers mirroring OpenTelemetry shim behaviour.
 */
// TODO(mn): Port OpenTelemetry global registration from cli-origin.js.
const globals = new Map();
function registerGlobal(name, value) {
    globals.set(name, value);
}
function getGlobal(name) {
    return globals.get(name);
}
function unregisterGlobal(name) {
    globals.delete(name);
}
