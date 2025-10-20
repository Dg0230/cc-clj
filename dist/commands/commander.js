"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.suggestSimilar = exports.humanReadableArgName = exports.InvalidArgumentError = exports.CommanderError = exports.Help = exports.argument = exports.Argument = exports.DualOptions = exports.Option = exports.Command = exports.program = void 0;
exports.createCommand = createCommand;
exports.createOption = createOption;
exports.createArgument = createArgument;
const errors_1 = require("../shared/cli/errors");
Object.defineProperty(exports, "CommanderError", { enumerable: true, get: function () { return errors_1.CommanderError; } });
Object.defineProperty(exports, "InvalidArgumentError", { enumerable: true, get: function () { return errors_1.InvalidArgumentError; } });
const argument_1 = require("./internal/argument");
Object.defineProperty(exports, "Argument", { enumerable: true, get: function () { return argument_1.Argument; } });
Object.defineProperty(exports, "argument", { enumerable: true, get: function () { return argument_1.argument; } });
Object.defineProperty(exports, "humanReadableArgName", { enumerable: true, get: function () { return argument_1.humanReadableArgName; } });
const command_1 = require("./internal/command");
Object.defineProperty(exports, "Command", { enumerable: true, get: function () { return command_1.Command; } });
const help_1 = require("./internal/help");
Object.defineProperty(exports, "Help", { enumerable: true, get: function () { return help_1.Help; } });
const option_1 = require("./internal/option");
Object.defineProperty(exports, "Option", { enumerable: true, get: function () { return option_1.Option; } });
Object.defineProperty(exports, "DualOptions", { enumerable: true, get: function () { return option_1.DualOptions; } });
const suggest_1 = require("./internal/suggest");
Object.defineProperty(exports, "suggestSimilar", { enumerable: true, get: function () { return suggest_1.suggestSimilar; } });
/**
 * Commander CLI integration staged from bundle module `bjQ`.
 *
 * The module re-exports the placeholder implementations defined in internal files
 * so the eventual port can retain the original surface area.
 */
// TODO(bjQ): Keep exports aligned with cli-origin.js aggregator module.
function createCommand(name) {
    return new command_1.Command(name);
}
const program = createCommand();
exports.program = program;
function createOption(flags, description, defaultValue) {
    const option = new option_1.Option(flags, description);
    if (defaultValue !== undefined) {
        option.default(defaultValue);
    }
    return option;
}
function createArgument(name, description) {
    return new argument_1.Argument(name, description);
}
exports.default = program;
