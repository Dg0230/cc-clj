/**
 * Shared AWS Smithy context helpers extracted from bundle scaffolding.
 */
export interface SmithyContext {
    readonly namespaces: Record<string, unknown>;
}
export declare function createSmithyContext(namespaces?: Record<string, unknown>): SmithyContext;
export declare const smithyContext: SmithyContext;
