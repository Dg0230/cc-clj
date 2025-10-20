/**
 * Custom AJV keyword placeholders derived from bundle keyword modules.
 */
export interface AjvKeywordDefinition {
    readonly keyword: string;
    readonly type?: string;
}
export declare const keywords: AjvKeywordDefinition[];
export declare const formats: {
    'date-time': (value: string) => boolean;
};
