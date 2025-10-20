"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidArgumentError = exports.CommanderError = void 0;
exports.todo = todo;
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
class InvalidArgumentError extends Error {
    constructor(message) {
        super(message);
        this.name = 'InvalidArgumentError';
    }
}
exports.InvalidArgumentError = InvalidArgumentError;
function todo(message = 'TODO: Commander error behaviour not yet implemented.') {
    throw new CommanderError('commander.todo', 1, message);
}
