import type { Argument } from './argument';
import type { Command } from './command';
import type { Option } from './option';
/**
 * Placeholder for the Commander help formatter (bundle module `xs0`).
 */
export declare class Help {
    formatHelp(command: Command): string;
    summary(command: Command): string;
    visibleOptions(command: Command): Option[];
    visibleCommands(command: Command): Command[];
    visibleArguments(command: Command): Argument[];
}
