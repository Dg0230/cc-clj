"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gaxios = exports.GaxiosError = exports.GAXIOS_ERROR_SYMBOL = void 0;
exports.defaultErrorRedactor = defaultErrorRedactor;
exports.GAXIOS_ERROR_SYMBOL = Symbol('GaxiosError');
class GaxiosError extends Error {
    constructor(message, config) {
        super(message);
        this[_a] = true;
        this.config = config;
        this.name = 'GaxiosError';
    }
}
exports.GaxiosError = GaxiosError;
_a = exports.GAXIOS_ERROR_SYMBOL;
function defaultErrorRedactor(error) {
    return error;
}
class Gaxios {
    async request(options) {
        throw new GaxiosError(`HTTP requests not implemented.`, options);
    }
}
exports.Gaxios = Gaxios;
Gaxios.instance = new Gaxios();
