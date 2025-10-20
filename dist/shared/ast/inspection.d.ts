import type { Node } from '@babel/types';
export interface NodeLocation {
    readonly line: number;
    readonly column: number;
}
export declare function getNodeLocation(node: Node | null | undefined): NodeLocation | null;
export declare function createSnippet(source: string, node: Node | null | undefined, maxLength?: number): string;
