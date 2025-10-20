import { categorizeModulesFromAnalysis } from '../../modules/categorizeModules';
import type { ModuleAnalysisResult } from '../../shared/types';

describe('categorizeModulesFromAnalysis', () => {
  it('groups modules into matching categories and reports unmatched entries', () => {
    const modules: ModuleAnalysisResult[] = [
      {
        moduleId: 'bjQ',
        location: null,
        params: { exports: 'exports', module: 'module' },
        dependencies: [],
        exports: [
          { type: 'assignment', code: 'exports.Command = Command', loc: null, target: 'Command' },
        ],
        stringLiterals: ['commander', 'Command'],
        callIdentifiers: [],
      },
      {
        moduleId: 'zz1',
        location: null,
        params: { exports: 'exports', module: 'module' },
        dependencies: [],
        exports: [],
        stringLiterals: ['misc'],
        callIdentifiers: [],
      },
    ];

    const result = categorizeModulesFromAnalysis(modules);
    expect(result.categories).toHaveLength(1);
    const commander = result.categories.find((category) => category.key === 'commands/commander');
    expect(commander?.modules[0].moduleId).toBe('bjQ');
    expect(result.unmatchedCount).toBe(1);
    expect(result.unmatchedSample[0].moduleId).toBe('zz1');
  });
});
