/**
 * Chalk template parsing placeholder derived from bundle module `j2B`.
 */
export interface TemplateChunk {
    readonly text: string;
}
export declare function parseTemplate(template: TemplateStringsArray, ...substitutions: unknown[]): TemplateChunk[];
