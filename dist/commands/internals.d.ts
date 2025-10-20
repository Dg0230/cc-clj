import { Option } from './option';
/**
 * Helper utilities used by the Commander command implementation (bundle module `RjQ`).
 */
export interface ParseOptionsResult {
    operands: string[];
    unknown: string[];
    optionValues: Record<string, unknown>;
}
export declare function parseTokens(tokens: readonly string[], knownOptions: readonly Option[], allowUnknown?: boolean): ParseOptionsResult;
