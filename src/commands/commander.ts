/**
 * Commander CLI integration staged from bundle module `bjQ`.
 *
 * The module re-exports the placeholder implementations defined in sibling files
 * so the eventual port can retain the original surface area.
 */
// TODO(bjQ): Keep exports aligned with cli-origin.js aggregator module.
export {
  Argument,
  argument,
  Command,
  CommanderError,
  Help,
  InvalidArgumentError,
  Option,
  createCommand,
  program,
} from './factory';
