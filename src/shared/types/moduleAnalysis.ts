import type { Node } from '@babel/types';

import type { NodeLocation } from '../ast';

export interface ExportStatement {
  readonly type: 'call' | 'assignment';
  readonly code: string;
  readonly loc: NodeLocation | null;
  readonly callee?: string;
  readonly target?: string;
}

export interface ModuleAnalysisResult {
  readonly moduleId: string;
  readonly location: NodeLocation | null;
  readonly params: {
    readonly exports: string | null;
    readonly module: string | null;
  };
  readonly dependencies: readonly string[];
  readonly exports: readonly ExportStatement[];
  readonly stringLiterals: readonly string[];
  readonly callIdentifiers: readonly string[];
}

export interface ModuleFactoryDescriptor {
  readonly idName: string;
  readonly factoryNode: Node;
}
