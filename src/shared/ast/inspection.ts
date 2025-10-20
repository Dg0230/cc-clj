import type { Node, SourceLocation } from '@babel/types';

export interface NodeLocation {
  readonly line: number;
  readonly column: number;
}

export function getNodeLocation(node: Node | null | undefined): NodeLocation | null {
  const loc = node?.loc as SourceLocation | undefined;
  if (!loc) {
    return null;
  }

  return {
    line: loc.start.line,
    column: loc.start.column,
  };
}

export function createSnippet(source: string, node: Node | null | undefined, maxLength = 200): string {
  if (!node) {
    return '';
  }

  const raw = source.slice((node as Node).start ?? 0, (node as Node).end ?? 0);
  const collapsed = raw.replace(/\s+/g, ' ').trim();
  if (collapsed.length > maxLength) {
    return `${collapsed.slice(0, Math.max(0, maxLength - 3))}...`;
  }
  return collapsed;
}
