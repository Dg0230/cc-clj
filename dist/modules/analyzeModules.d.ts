import type { ModuleAnalysisResult } from '../shared/types';
export interface ModuleAnalysisOptions {
    readonly bundlePath?: string;
    readonly analysisOutputPath?: string;
}
export declare const DEFAULT_BUNDLE_PATH: string;
export declare const DEFAULT_ANALYSIS_OUTPUT_PATH: string;
export declare function analyzeBundleSource(source: string): ModuleAnalysisResult[];
export declare function analyzeCliBundle(options?: ModuleAnalysisOptions): ModuleAnalysisResult[];
export declare function writeAnalysisToFile(results: readonly ModuleAnalysisResult[], options?: ModuleAnalysisOptions): string;
export declare function analyzeAndWrite(options?: ModuleAnalysisOptions): {
    readonly outputPath: string;
    readonly results: readonly ModuleAnalysisResult[];
};
