"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Option = exports.InvalidArgumentError = exports.Help = exports.CommanderError = exports.Command = exports.argument = exports.Argument = exports.program = void 0;
exports.createCommand = createCommand;
const argument_1 = require("./argument");
Object.defineProperty(exports, "Argument", { enumerable: true, get: function () { return argument_1.Argument; } });
Object.defineProperty(exports, "argument", { enumerable: true, get: function () { return argument_1.argument; } });
const errors_1 = require("./errors");
Object.defineProperty(exports, "CommanderError", { enumerable: true, get: function () { return errors_1.CommanderError; } });
Object.defineProperty(exports, "InvalidArgumentError", { enumerable: true, get: function () { return errors_1.InvalidArgumentError; } });
const help_1 = require("./help");
Object.defineProperty(exports, "Help", { enumerable: true, get: function () { return help_1.Help; } });
const command_1 = require("./command");
Object.defineProperty(exports, "Command", { enumerable: true, get: function () { return command_1.Command; } });
const option_1 = require("./option");
Object.defineProperty(exports, "Option", { enumerable: true, get: function () { return option_1.Option; } });
/**
 * Aggregates the Commander exports and exposes `createCommand` (bundle module `xjQ`).
 */
// TODO(xjQ): Verify export surface while porting cli-origin.js logic.
function createCommand(name) {
    return new command_1.Command(name);
}
exports.program = createCommand();
