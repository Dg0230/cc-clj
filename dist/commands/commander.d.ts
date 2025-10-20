import { CommanderError, InvalidArgumentError } from '../shared/cli/errors';
import { Argument, argument, humanReadableArgName } from './internal/argument';
import { Command } from './internal/command';
import { Help } from './internal/help';
import { Option, DualOptions } from './internal/option';
import { suggestSimilar } from './internal/suggest';
/**
 * Commander CLI integration staged from bundle module `bjQ`.
 *
 * The module re-exports the placeholder implementations defined in internal files
 * so the eventual port can retain the original surface area.
 */
declare function createCommand(name?: string): Command;
declare const program: Command;
declare function createOption<T = unknown>(flags: string, description?: string, defaultValue?: T): Option<T>;
declare function createArgument<T = unknown>(name: string, description?: string): Argument<T>;
export { program, Command, Option, DualOptions, Argument, argument, Help, CommanderError, InvalidArgumentError, humanReadableArgName, suggestSimilar, createCommand, createOption, createArgument, };
export default program;
