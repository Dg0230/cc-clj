"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.diag = void 0;
class NoopDiagLogger {
    warn(message) {
        console.warn(message);
    }
    error(message) {
        console.error(message);
    }
    debug(message) {
        console.debug(message);
    }
}
exports.diag = new NoopDiagLogger();
