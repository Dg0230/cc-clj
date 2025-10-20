import { CommanderError } from './errors';
import { Option } from './option';

/**
 * Helper utilities used by the Commander command implementation (bundle module `RjQ`).
 */
// TODO(RjQ): Replace parsing utilities with bundle logic.
export interface ParseOptionsResult {
  operands: string[];
  unknown: string[];
  optionValues: Record<string, unknown>;
}

export function parseTokens(
  tokens: readonly string[],
  knownOptions: readonly Option[],
  allowUnknown = false,
): ParseOptionsResult {
  const operands: string[] = [];
  const unknown: string[] = [];
  const optionValues: Record<string, unknown> = {};

  const findOption = (flag: string): Option | undefined => {
    return knownOptions.find((option) => option.short === flag || option.long === flag);
  };

  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    if (!token.startsWith('-') || token === '-') {
      operands.push(token);
      continue;
    }

    const option = findOption(token);
    if (!option) {
      if (allowUnknown) {
        unknown.push(token);
        continue;
      }
      throw new CommanderError('commander.unknownOption', 1, `Unknown option '${token}'.`);
    }

    let valueToken: string | undefined;
    if (option.isVariadic()) {
      const remaining = tokens.slice(index + 1);
      valueToken = remaining.join(' ');
      index = tokens.length;
    } else if (tokens[index + 1] && !tokens[index + 1].startsWith('-')) {
      valueToken = tokens[index + 1];
      index += 1;
    }

    const previousValue = optionValues[option.attributeName()] as unknown;
    const parsed = option.parse(valueToken ?? 'true', previousValue);
    optionValues[option.attributeName()] = parsed;
  }

  return { operands, unknown, optionValues };
}
