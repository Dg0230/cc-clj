"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidArgumentError = exports.CommanderError = void 0;
/**
 * Minimal Commander error implementations staged from bundle module `aC1`.
 *
 * The real logic will be ported from the cli-origin.js bundle; this placeholder
 * only mirrors the exported surface.
 */
// TODO(aC1): Port Commander error handling from cli-origin.js.
class CommanderError extends Error {
    constructor(code, exitCode, message) {
        super(message);
        this.code = code;
        this.exitCode = exitCode;
        this.name = 'CommanderError';
    }
}
exports.CommanderError = CommanderError;
class InvalidArgumentError extends CommanderError {
    constructor(message) {
        super('commander.invalidArgument', 1, message);
        this.name = 'InvalidArgumentError';
    }
}
exports.InvalidArgumentError = InvalidArgumentError;
