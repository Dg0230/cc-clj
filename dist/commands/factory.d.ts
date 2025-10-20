import { Argument, argument } from './argument';
import { CommanderError, InvalidArgumentError } from './errors';
import { Help } from './help';
import { Command } from './command';
import { Option } from './option';
/**
 * Aggregates the Commander exports and exposes `createCommand` (bundle module `xjQ`).
 */
export declare function createCommand(name?: string): Command;
export declare const program: Command;
export { Argument, argument, Command, CommanderError, Help, InvalidArgumentError, Option, };
