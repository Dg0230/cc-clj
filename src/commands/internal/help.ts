import type { Argument } from './argument';
import { humanReadableArgName } from './argument';
import type { Command } from './command';
import type { Option } from './option';

/**
 * Placeholder for the Commander help formatter (bundle module `xs0`).
 */
// TODO(xs0): Port Help formatting logic from cli-origin.js.
export class Help {
  public formatHelp(command: Command): string {
    const lines: string[] = [];
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
        lines.push(`  ${humanReadableArgName(arg)}`);
      }
    }

    return lines.join('\n').trim();
  }

  public summary(command: Command): string {
    const description = command.description();
    return description ? `${command.name()} - ${description}` : command.name();
  }

  public visibleOptions(command: Command): Option[] {
    return [...command.options];
  }

  public visibleCommands(command: Command): Command[] {
    return [...command.commands];
  }

  public visibleArguments(command: Command): Argument[] {
    return [...command.arguments];
  }
}
