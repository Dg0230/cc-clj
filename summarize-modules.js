const fs = require('node:fs');

const modules = JSON.parse(fs.readFileSync('module-analysis.json', 'utf8'));

const aliasMap = new Map();

for (const mod of modules) {
  const entries = mod.exports || [];
  const aliasSet = new Set();
  for (const entry of entries) {
    if (!entry.target) continue;
    const target = entry.target;
    const alias = target.includes('.') ? target.split('.')[0] : target;
    aliasSet.add(alias);
  }
  for (const alias of aliasSet) {
    if (!aliasMap.has(alias)) {
      aliasMap.set(alias, { modules: new Set(), samples: [], stringLiterals: new Set() });
    }
    const data = aliasMap.get(alias);
    data.modules.add(mod.moduleId);
    for (const entry of entries) {
      if (!entry.target) continue;
      const target = entry.target;
      if ((target === alias || target.startsWith(alias + '.')) && data.samples.length < 3) {
        data.samples.push(entry.code);
      }
    }
    const strings = mod.stringLiterals || [];
    for (const value of strings) {
      if (data.stringLiterals.size >= 20) break;
      data.stringLiterals.add(value);
    }
  }
}

const summary = Array.from(aliasMap.entries()).map(([alias, data]) => ({
  alias,
  moduleCount: data.modules.size,
  moduleIds: Array.from(data.modules),
  samples: data.samples,
  stringLiterals: Array.from(data.stringLiterals),
})).sort((a, b) => b.moduleCount - a.moduleCount || a.alias.localeCompare(b.alias));

console.log(JSON.stringify(summary, null, 2));
