import { parse } from '@babel/parser';
import type { ParserPlugin } from '@babel/parser';
import type { File } from '@babel/types';

export interface ParserOptions {
  readonly sourceType: 'module' | 'script' | 'unambiguous';
  readonly plugins: readonly ParserPlugin[];
  readonly allowReturnOutsideFunction: boolean;
  readonly allowAwaitOutsideFunction: boolean;
  readonly allowImportExportEverywhere: boolean;
}

const defaultPlugins: ParserPlugin[] = [
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
];

export const defaultParserOptions: ParserOptions = {
  sourceType: 'module',
  plugins: defaultPlugins,
  allowReturnOutsideFunction: true,
  allowAwaitOutsideFunction: true,
  allowImportExportEverywhere: true,
};

export function parseSource(code: string, options: ParserOptions = defaultParserOptions): File {
  const parserOptions: Parameters<typeof parse>[1] = {
    ...options,
    plugins: [...options.plugins],
  };

  return parse(code, parserOptions) as File;
}
