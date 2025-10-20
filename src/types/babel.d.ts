declare module '@babel/types' {
  export interface SourcePosition {
    line: number;
    column: number;
  }

  export interface SourceLocation {
    start: SourcePosition;
    end: SourcePosition;
  }

  export interface Node {
    type: string;
    start?: number | null;
    end?: number | null;
    loc?: SourceLocation | null;
    [key: string]: unknown;
  }

  export interface Identifier extends Node {
    name: string;
  }

  export interface Expression extends Node {}

  export interface CallExpression extends Expression {
    callee: Node;
    arguments: Node[];
  }

  export interface MemberExpression extends Expression {
    object: Node;
    property: Node;
    computed: boolean;
  }

  export interface StringLiteral extends Expression {
    value: string;
  }

  export interface TemplateElement extends Node {
    value?: { cooked?: string | null; raw?: string | null };
  }

  export interface FunctionExpression extends Expression {
    params: Node[];
    body: Node;
  }

  export interface ArrowFunctionExpression extends FunctionExpression {}

  export interface VariableDeclarator extends Node {
    id: Node | null;
    init?: Node | null;
  }

  export interface File extends Node {
    type: 'File';
    program: Node;
  }
}

declare module '@babel/parser' {
  import type { File } from '@babel/types';

  export type ParserPlugin = string | [string, Record<string, unknown>?];

  export interface ParserOptions {
    sourceType?: 'script' | 'module' | 'unambiguous';
    plugins?: ParserPlugin[];
    allowReturnOutsideFunction?: boolean;
    allowAwaitOutsideFunction?: boolean;
    allowImportExportEverywhere?: boolean;
    [key: string]: unknown;
  }

  export function parse(code: string, options?: ParserOptions): File;
}
