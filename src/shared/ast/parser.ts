import { parse } from '@babel/parser';
import type { File } from '@babel/types';

export interface ParserOptions {
  readonly sourceType: 'module' | 'script' | 'unambiguous';
  readonly plugins: readonly string[];
  readonly allowReturnOutsideFunction: boolean;
  readonly allowAwaitOutsideFunction: boolean;
  readonly allowImportExportEverywhere: boolean;
}

export const defaultParserOptions: ParserOptions = {
  sourceType: 'module',
  plugins: [
    'importMeta',
    'classProperties',
    'classPrivateProperties',
    'classPrivateMethods',
    'dynamicImport',
    'optionalChaining',
    'nullishCoalescingOperator',
    'numericSeparator',
    'topLevelAwait',
    'bigInt',
    'jsx',
    'logicalAssignment',
    'exportDefaultFrom',
    'exportNamespaceFrom',
  ],
  allowReturnOutsideFunction: true,
  allowAwaitOutsideFunction: true,
  allowImportExportEverywhere: true,
};

export function parseSource(code: string, options: ParserOptions = defaultParserOptions): File {
  return parse(code, options) as File;
}
