export interface SummaryEntry {
    readonly alias: string;
    readonly moduleCount: number;
    readonly moduleIds: readonly string[];
    readonly samples: readonly string[];
    readonly stringLiterals: readonly string[];
}
export interface SummarizeOptions {
    readonly analysisPath?: string;
}
export declare const DEFAULT_SUMMARY_ANALYSIS_PATH: string;
export declare function summarizeModules(options?: SummarizeOptions): SummaryEntry[];
