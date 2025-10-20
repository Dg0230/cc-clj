export interface BabelNode {
    type: string;
    start?: number | null;
    end?: number | null;
    [key: string]: unknown;
}
export interface JsescOptions {
    minimal?: boolean;
    [key: string]: unknown;
}
export interface GeneratorOptions {
    retainLines?: boolean;
    compact?: boolean | 'auto';
    concise?: boolean;
    comments?: boolean;
    decoratorsBeforeExport?: boolean;
    jsescOption?: JsescOptions;
    [key: string]: unknown;
}
export interface GeneratorResult {
    code: string;
    map: unknown;
    rawMappings?: unknown;
}
export interface GenerateCodeParams {
    ast: BabelNode;
    options?: GeneratorOptions;
    originalCode?: string;
}
export declare function generateCode({ ast, options, originalCode }: GenerateCodeParams): GeneratorResult;
