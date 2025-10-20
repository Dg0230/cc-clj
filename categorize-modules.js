const fs = require('node:fs');

const modules = JSON.parse(fs.readFileSync('module-analysis.json', 'utf8'));

function normalizeStrings(values = []) {
  return values
    .filter((value) => typeof value === 'string')
    .map((value) => value.trim())
    .filter((value) => value.length > 0);
}

function lower(strings) {
  return normalizeStrings(strings).map((value) => value.toLowerCase());
}

const commanderModuleIds = new Set(['aC1', 'He1', 'xs0', 'vs0', 'RjQ', 'SjQ', 'xjQ', 'bjQ']);

const categories = [
  {
    key: 'commands/commander',
    description: 'Commander CLI composition: command builder, arguments, options, and re-export facade.',
    suggestedDir: 'src/commands',
    suggestedFile: 'commander.ts',
    match(mod, info) {
      if (commanderModuleIds.has(mod.moduleId)) {
        const evidence = [];
        if (info.strings.some((str) => str.includes('commander'))) {
          evidence.push(info.strings.find((str) => str.includes('commander')));
        }
        const matchingTarget = info.targets.find((target) => /(command|argument|option|help)/.test(target));
        if (matchingTarget) evidence.push(`export:${matchingTarget}`);
        if (info.dependencies.length) {
          evidence.push(`deps:${info.dependencies.join(',')}`);
        }
        return { match: true, evidence };
      }
      return { match: false };
    }
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
    }
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
    }
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
    }
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
    }
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
    }
  },
  {
    key: 'utils/validation',
    description: 'Schema validation helpers (Ajv / JSON schema tooling).',
    suggestedDir: 'src/utils/validation',
    suggestedFile: 'schema.ts',
    match(mod, info) {
      if (info.isAws) return { match: false };
      const keywords = ['schema', 'ajv', 'validate', 'validator'];
      const hit = info.strings.find((str) => keywords.some((kw) => str.includes(kw)));
      if (hit) {
        return { match: true, evidence: [hit] };
      }
      return { match: false };
    }
  }
];

const categoryMap = new Map(categories.map((cat) => [cat.key, { ...cat, modules: [] }]));
const unmatched = [];

for (const mod of modules) {
  const strings = normalizeStrings(mod.stringLiterals);
  const lowerStrings = lower(mod.stringLiterals);
  const targets = normalizeStrings((mod.exports || []).map((entry) => entry.target || ''));
  const lowerTargets = lower(targets);
  const dependencies = Array.isArray(mod.dependencies) ? mod.dependencies : [];
  const info = {
    strings: lowerStrings,
    targets: lowerTargets,
    dependencies,
    isAws: lowerStrings.some((str) => str.includes('aws') || str.includes('@aws-sdk') || str.includes('smithy') || str.includes('amazon') || str.includes('bedrock') || str.includes('iam') || str.includes('sigv4') || str.includes('credential') || str.includes('sts'))
  };

  let assigned = null;
  for (const category of categories) {
    const result = category.match(mod, info);
    if (result.match) {
      assigned = { key: category.key, evidence: result.evidence || [] };
      break;
    }
  }

  if (assigned) {
    const entry = categoryMap.get(assigned.key);
    entry.modules.push({
      moduleId: mod.moduleId,
      evidence: assigned.evidence.slice(0, 5)
    });
  } else {
    unmatched.push({ moduleId: mod.moduleId, strings: lowerStrings.slice(0, 3), targets: lowerTargets.slice(0, 3) });
  }
}

const categorized = Array.from(categoryMap.values()).filter((cat) => cat.modules.length > 0);

const output = {
  categories: categorized.map((cat) => ({
    key: cat.key,
    description: cat.description,
    suggestedDir: cat.suggestedDir,
    suggestedFile: cat.suggestedFile,
    modules: cat.modules
  })),
  unmatchedCount: unmatched.length,
  unmatchedSample: unmatched.slice(0, 20)
};

fs.writeFileSync('module-groups.json', JSON.stringify(output, null, 2));
console.log('Categorized modules written to module-groups.json');
