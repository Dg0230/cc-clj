import { join } from 'node:path';

import { readJsonFile } from '../shared/io';
import type { ModuleAnalysisResult } from '../shared/types';

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

export const DEFAULT_SUMMARY_ANALYSIS_PATH = join(__dirname, '..', '..', 'module-analysis.json');

export function summarizeModules(options: SummarizeOptions = {}): SummaryEntry[] {
  const analysisPath = options.analysisPath ?? DEFAULT_SUMMARY_ANALYSIS_PATH;
  const modules = readJsonFile<ModuleAnalysisResult[]>(analysisPath);
  const aliasMap = new Map<
    string,
    {
      modules: Set<string>;
      samples: string[];
      stringLiterals: Set<string>;
    }
  >();

  for (const mod of modules) {
    const entries = mod.exports ?? [];
    const aliasSet = new Set<string>();
    for (const entry of entries) {
      if (!entry.target) {
        continue;
      }
      const target = entry.target;
      const alias = target.includes('.') ? target.split('.')[0] : target;
      aliasSet.add(alias);
    }
    for (const alias of aliasSet) {
      if (!aliasMap.has(alias)) {
        aliasMap.set(alias, { modules: new Set(), samples: [], stringLiterals: new Set() });
      }
      const data = aliasMap.get(alias)!;
      data.modules.add(mod.moduleId);
      for (const entry of entries) {
        if (!entry.target) {
          continue;
        }
        const target = entry.target;
        if ((target === alias || target.startsWith(`${alias}.`)) && data.samples.length < 3) {
          data.samples.push(entry.code);
        }
      }
      const strings = mod.stringLiterals ?? [];
      for (const value of strings) {
        if (data.stringLiterals.size >= 20) {
          break;
        }
        data.stringLiterals.add(value);
      }
    }
  }

  return Array.from(aliasMap.entries())
    .map(([alias, data]) => ({
      alias,
      moduleCount: data.modules.size,
      moduleIds: Array.from(data.modules),
      samples: data.samples,
      stringLiterals: Array.from(data.stringLiterals),
    }))
    .sort((a, b) => b.moduleCount - a.moduleCount || a.alias.localeCompare(b.alias));
}
