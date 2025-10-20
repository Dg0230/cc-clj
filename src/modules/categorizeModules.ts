import { join } from 'node:path';

import { readJsonFile, writeJsonFile } from '../shared/io';
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

export const DEFAULT_CATEGORIZE_ANALYSIS_PATH = join(__dirname, '..', '..', 'module-analysis.json');
export const DEFAULT_CATEGORY_OUTPUT_PATH = join(__dirname, '..', '..', 'module-groups.json');

type CategoryMatchResult = { readonly match: true; readonly evidence: readonly string[] } | { readonly match: false };

interface CategoryDefinition {
  readonly key: string;
  readonly description: string;
  readonly suggestedDir: string;
  readonly suggestedFile: string;
  readonly match: (mod: ModuleAnalysisResult, info: ModuleInfo) => CategoryMatchResult;
}

interface ModuleInfo {
  readonly strings: readonly string[];
  readonly targets: readonly string[];
  readonly dependencies: readonly string[];
  readonly isAws: boolean;
}

const commanderModuleIds = new Set(['aC1', 'He1', 'xs0', 'vs0', 'RjQ', 'SjQ', 'xjQ', 'bjQ']);

const categories: CategoryDefinition[] = [
  {
    key: 'commands/commander',
    description: 'Commander CLI composition: command builder, arguments, options, and re-export facade.',
    suggestedDir: 'src/commands',
    suggestedFile: 'commander.ts',
    match(mod, info) {
      if (commanderModuleIds.has(mod.moduleId)) {
        const evidence: string[] = [];
        const commanderString = info.strings.find((value) => value.includes('commander'));
        if (commanderString) {
          evidence.push(commanderString);
        }
        const matchingTarget = info.targets.find((target) => /(command|argument|option|help)/.test(target));
        if (matchingTarget) {
          evidence.push(`export:${matchingTarget}`);
        }
        if (info.dependencies.length) {
          evidence.push(`deps:${info.dependencies.join(',')}`);
        }
        return { match: true, evidence };
      }
      return { match: false };
    },
  },
  {
    key: 'services/aws',
    description: 'AWS SDK (Smithy-generated clients, credential providers, and auth helpers).',
    suggestedDir: 'src/services/aws',
    suggestedFile: 'sdk.ts',
    match(mod, info) {
      const awsKeywords = ['@aws-sdk', 'aws', 'smithy', 'bedrock', 'amazon', 'sso', 'sigv4', 'credential', 'iam'];
      const hit = info.strings.find((str) => awsKeywords.some((kw) => str.includes(kw)));
      if (hit) {
        return { match: true, evidence: [hit] };
      }
      return { match: false };
    },
  },
  {
    key: 'services/telemetry',
    description: 'OpenTelemetry API wiring and baggage/span utilities.',
    suggestedDir: 'src/services/telemetry',
    suggestedFile: 'opentelemetry.ts',
    match(mod, info) {
      const hit = info.strings.find((str) => str.includes('telemetry') || str.includes('opentelemetry') || str.includes('otel'));
      if (hit) {
        return { match: true, evidence: [hit] };
      }
      return { match: false };
    },
  },
  {
    key: 'services/http',
    description: 'Axios HTTP client helpers.',
    suggestedDir: 'src/services/http',
    suggestedFile: 'axios.ts',
    match(mod, info) {
      const hit = info.strings.find((str) => str.includes('axios'));
      if (hit) {
        return { match: true, evidence: [hit] };
      }
      return { match: false };
    },
  },
  {
    key: 'ui/react',
    description: 'React core runtime exports.',
    suggestedDir: 'src/ui/react',
    suggestedFile: 'react.ts',
    match(mod, info) {
      const reactHits = info.strings.filter((str) => str.startsWith('react.'));
      if (reactHits.length) {
        return { match: true, evidence: reactHits.slice(0, 3) };
      }
      return { match: false };
    },
  },
  {
    key: 'ui/terminal',
    description: 'Terminal styling utilities (Chalk).',
    suggestedDir: 'src/ui/terminal',
    suggestedFile: 'chalk.ts',
    match(mod, info) {
      const hit = info.strings.find((str) => str.includes('chalk'));
      if (hit) {
        return { match: true, evidence: [hit] };
      }
      return { match: false };
    },
  },
  {
    key: 'utils/validation',
    description: 'Schema validation helpers (Ajv / JSON schema tooling).',
    suggestedDir: 'src/utils/validation',
    suggestedFile: 'schema.ts',
    match(mod, info) {
      if (info.isAws) {
        return { match: false };
      }
      const keywords = ['schema', 'ajv', 'validate', 'validator'];
      const hit = info.strings.find((str) => keywords.some((kw) => str.includes(kw)));
      if (hit) {
        return { match: true, evidence: [hit] };
      }
      return { match: false };
    },
  },
];

function normalizeStrings(values: readonly unknown[] = []): string[] {
  return values
    .filter((value): value is string => typeof value === 'string')
    .map((value) => value.trim())
    .filter((value) => value.length > 0);
}

function toLowerCaseStrings(strings: readonly string[]): string[] {
  return normalizeStrings(strings).map((value) => value.toLowerCase());
}

function createModuleInfo(mod: ModuleAnalysisResult): ModuleInfo {
  const strings = normalizeStrings(mod.stringLiterals);
  const lowerStrings = toLowerCaseStrings(strings);
  const targets = normalizeStrings((mod.exports ?? []).map((entry) => entry.target ?? ''));
  const lowerTargets = toLowerCaseStrings(targets);
  const dependencies = Array.isArray(mod.dependencies) ? mod.dependencies : [];
  return {
    strings: lowerStrings,
    targets: lowerTargets,
    dependencies,
    isAws: lowerStrings.some((str) =>
      ['aws', '@aws-sdk', 'smithy', 'amazon', 'bedrock', 'iam', 'sigv4', 'credential', 'sts'].some((kw) => str.includes(kw)),
    ),
  };
}

export function categorizeModulesFromAnalysis(modules: readonly ModuleAnalysisResult[]): CategorizationOutput {
  const categoryMap = new Map<string, ModuleCategory & { modules: ModuleCategoryEntry[] }>();
  for (const definition of categories) {
    categoryMap.set(definition.key, {
      key: definition.key,
      description: definition.description,
      suggestedDir: definition.suggestedDir,
      suggestedFile: definition.suggestedFile,
      modules: [],
    });
  }

  const unmatched: UnmatchedModule[] = [];

  for (const mod of modules) {
    const info = createModuleInfo(mod);
    let assigned: { key: string; evidence: readonly string[] } | null = null;
    for (const definition of categories) {
      const result = definition.match(mod, info);
      if (result.match) {
        assigned = { key: definition.key, evidence: result.evidence.slice(0, 5) };
        break;
      }
    }

    if (assigned) {
      const entry = categoryMap.get(assigned.key);
      if (entry) {
        entry.modules.push({
          moduleId: mod.moduleId,
          evidence: Array.from(assigned.evidence),
        });
      }
    } else {
      unmatched.push({
        moduleId: mod.moduleId,
        strings: info.strings.slice(0, 3),
        targets: info.targets.slice(0, 3),
      });
    }
  }

  const categorized = Array.from(categoryMap.values()).filter((category) => category.modules.length > 0);

  return {
    categories: categorized.map((category) => ({
      key: category.key,
      description: category.description,
      suggestedDir: category.suggestedDir,
      suggestedFile: category.suggestedFile,
      modules: category.modules,
    })),
    unmatchedCount: unmatched.length,
    unmatchedSample: unmatched.slice(0, 20),
  };
}

export function categorizeModules(options: CategorizeOptions = {}): CategorizationOutput {
  const analysisPath = options.analysisPath ?? DEFAULT_CATEGORIZE_ANALYSIS_PATH;
  const modules = readJsonFile<ModuleAnalysisResult[]>(analysisPath);
  const output = categorizeModulesFromAnalysis(modules);
  const outputPath = options.outputPath ?? DEFAULT_CATEGORY_OUTPUT_PATH;
  writeJsonFile(outputPath, output);
  return output;
}
