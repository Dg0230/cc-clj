"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.program = exports.createCommand = exports.Option = exports.InvalidArgumentError = exports.Help = exports.CommanderError = exports.Command = exports.argument = exports.Argument = void 0;
/**
 * Commander CLI integration staged from bundle module `bjQ`.
 *
 * The module re-exports the placeholder implementations defined in sibling files
 * so the eventual port can retain the original surface area.
 */
// TODO(bjQ): Keep exports aligned with cli-origin.js aggregator module.
var factory_1 = require("./factory");
Object.defineProperty(exports, "Argument", { enumerable: true, get: function () { return factory_1.Argument; } });
Object.defineProperty(exports, "argument", { enumerable: true, get: function () { return factory_1.argument; } });
Object.defineProperty(exports, "Command", { enumerable: true, get: function () { return factory_1.Command; } });
Object.defineProperty(exports, "CommanderError", { enumerable: true, get: function () { return factory_1.CommanderError; } });
Object.defineProperty(exports, "Help", { enumerable: true, get: function () { return factory_1.Help; } });
Object.defineProperty(exports, "InvalidArgumentError", { enumerable: true, get: function () { return factory_1.InvalidArgumentError; } });
Object.defineProperty(exports, "Option", { enumerable: true, get: function () { return factory_1.Option; } });
Object.defineProperty(exports, "createCommand", { enumerable: true, get: function () { return factory_1.createCommand; } });
Object.defineProperty(exports, "program", { enumerable: true, get: function () { return factory_1.program; } });
