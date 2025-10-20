import type { ModuleAnalysisResult } from '../shared/types';
export interface ModuleCategory {
    readonly key: string;
    readonly description: string;
    readonly suggestedDir: string;
    readonly suggestedFile: string;
    readonly modules: readonly ModuleCategoryEntry[];
}
export interface ModuleCategoryEntry {
    readonly moduleId: string;
    readonly evidence: readonly string[];
}
export interface CategorizationOutput {
    readonly categories: readonly ModuleCategory[];
    readonly unmatchedCount: number;
    readonly unmatchedSample: readonly UnmatchedModule[];
}
export interface UnmatchedModule {
    readonly moduleId: string;
    readonly strings: readonly string[];
    readonly targets: readonly string[];
}
export interface CategorizeOptions {
    readonly analysisPath?: string;
    readonly outputPath?: string;
}
export declare const DEFAULT_CATEGORIZE_ANALYSIS_PATH: string;
export declare const DEFAULT_CATEGORY_OUTPUT_PATH: string;
export declare function categorizeModulesFromAnalysis(modules: readonly ModuleAnalysisResult[]): CategorizationOutput;
export declare function categorizeModules(options?: CategorizeOptions): CategorizationOutput;
