"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_SUMMARY_ANALYSIS_PATH = void 0;
exports.summarizeModules = summarizeModules;
const node_path_1 = require("node:path");
const io_1 = require("../shared/io");
exports.DEFAULT_SUMMARY_ANALYSIS_PATH = (0, node_path_1.join)(__dirname, '..', '..', 'module-analysis.json');
function summarizeModules(options = {}) {
    var _a, _b, _c;
    const analysisPath = (_a = options.analysisPath) !== null && _a !== void 0 ? _a : exports.DEFAULT_SUMMARY_ANALYSIS_PATH;
    const modules = (0, io_1.readJsonFile)(analysisPath);
    const aliasMap = new Map();
    for (const mod of modules) {
        const entries = (_b = mod.exports) !== null && _b !== void 0 ? _b : [];
        const aliasSet = new Set();
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
            const data = aliasMap.get(alias);
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
            const strings = (_c = mod.stringLiterals) !== null && _c !== void 0 ? _c : [];
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
