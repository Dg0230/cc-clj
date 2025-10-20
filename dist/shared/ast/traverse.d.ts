import type { Node } from '@babel/types';
export type TraversalCallback = (node: Node, parent: Node | null) => void;
export declare function traverseAst(root: Node | null | undefined, enter: TraversalCallback, parent?: Node | null): void;
