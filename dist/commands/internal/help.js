"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Help = void 0;
const argument_1 = require("./argument");
/**
 * Placeholder for the Commander help formatter (bundle module `xs0`).
 */
// TODO(xs0): Port Help formatting logic from cli-origin.js.
class Help {
    formatHelp(command) {
        const lines = [];
        lines.push(this.summary(command));
        const options = this.visibleOptions(command);
        if (options.length) {
            lines.push('', 'Options:');
            for (const option of options) {
                lines.push(`  ${option.flags}${option.description ? `\t${option.description}` : ''}`);
            }
        }
        const subcommands = this.visibleCommands(command);
        if (subcommands.length) {
            lines.push('', 'Commands:');
            for (const sub of subcommands) {
                lines.push(`  ${sub.name()}${sub.description() ? `\t${sub.description()}` : ''}`);
            }
        }
        const args = this.visibleArguments(command);
        if (args.length) {
            lines.push('', 'Arguments:');
            for (const arg of args) {
                lines.push(`  ${(0, argument_1.humanReadableArgName)(arg)}`);
            }
        }
        return lines.join('\n').trim();
    }
    summary(command) {
        const description = command.description();
        return description ? `${command.name()} - ${description}` : command.name();
    }
    visibleOptions(command) {
        return [...command.options];
    }
    visibleCommands(command) {
        return [...command.commands];
    }
    visibleArguments(command) {
        return [...command.arguments];
    }
}
exports.Help = Help;
