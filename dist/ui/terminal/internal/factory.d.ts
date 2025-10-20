import { TemplateChunk } from './template';
/**
 * Chalk factory placeholder derived from bundle module `f2B`.
 */
export interface ChalkTheme {
    readonly enabled: boolean;
}
export declare const DEFAULT_THEME: ChalkTheme;
export declare class ChalkFactory {
    private readonly theme;
    constructor(theme?: ChalkTheme);
    template(template: TemplateStringsArray, ...substitutions: unknown[]): TemplateChunk[];
    withTheme(theme: ChalkTheme): ChalkFactory;
}
export declare function toJson(theme: ChalkTheme): string;
export declare function fromJson(serialized: string): ChalkTheme;
