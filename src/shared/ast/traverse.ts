import type { Node } from '@babel/types';

export type TraversalCallback = (node: Node, parent: Node | null) => void;

export function traverseAst(root: Node | null | undefined, enter: TraversalCallback, parent: Node | null = null): void {
  if (!root || typeof (root as Node).type !== 'string') {
    return;
  }

  enter(root, parent);

  for (const key of Object.keys(root)) {
    if (key === 'loc' || key.endsWith('Comments')) {
      continue;
    }

    const value = (root as Record<string, unknown>)[key];
    if (!value) {
      continue;
    }

    if (Array.isArray(value)) {
      for (const child of value) {
        if (child && typeof (child as Node).type === 'string') {
          traverseAst(child as Node, enter, root);
        }
      }
    } else if (typeof (value as Node).type === 'string') {
      traverseAst(value as Node, enter, root);
    }
  }
}
