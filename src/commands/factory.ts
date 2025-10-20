import { Argument, argument } from './argument';
import { CommanderError, InvalidArgumentError } from './errors';
import { Help } from './help';
import { Command } from './command';
import { Option } from './option';

/**
 * Aggregates the Commander exports and exposes `createCommand` (bundle module `xjQ`).
 */
// TODO(xjQ): Verify export surface while porting cli-origin.js logic.
export function createCommand(name?: string): Command {
  return new Command(name);
}

export const program = createCommand();

export {
  Argument,
  argument,
  Command,
  CommanderError,
  Help,
  InvalidArgumentError,
  Option,
};
