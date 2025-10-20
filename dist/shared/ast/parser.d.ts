import type { ParserPlugin } from '@babel/parser';
import type { File } from '@babel/types';
export interface ParserOptions {
    readonly sourceType: 'module' | 'script' | 'unambiguous';
    readonly plugins: readonly ParserPlugin[];
    readonly allowReturnOutsideFunction: boolean;
    readonly allowAwaitOutsideFunction: boolean;
    readonly allowImportExportEverywhere: boolean;
}
export declare const defaultParserOptions: ParserOptions;
export declare function parseSource(code: string, options?: ParserOptions): File;
