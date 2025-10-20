import { summarizeModules } from '../../modules/summarizeModules';
import type { ModuleAnalysisResult } from '../../shared/types';

jest.mock('../../shared/io', () => ({
  readJsonFile: jest.fn(),
}));

const { readJsonFile } = jest.requireMock('../../shared/io');

describe('summarizeModules', () => {
  it('groups exports by alias and sorts by module count', () => {
    const modules: ModuleAnalysisResult[] = [
      {
        moduleId: 'a1',
        location: null,
        params: { exports: 'exports', module: 'module' },
        dependencies: [],
        exports: [
          { type: 'assignment', code: 'exports.foo = foo', loc: null, target: 'foo' },
          { type: 'assignment', code: 'exports.foo.bar = bar', loc: null, target: 'foo.bar' },
        ],
        stringLiterals: ['foo'],
        callIdentifiers: [],
      },
      {
        moduleId: 'b1',
        location: null,
        params: { exports: 'exports', module: 'module' },
        dependencies: [],
        exports: [
          { type: 'assignment', code: 'exports.bar = bar', loc: null, target: 'bar' },
        ],
        stringLiterals: ['bar'],
        callIdentifiers: [],
      },
    ];

    readJsonFile.mockReturnValue(modules);

    const summary = summarizeModules();
    expect(summary).toHaveLength(2);
    expect(summary[0].alias).toBe('bar');
    expect(summary[1].alias).toBe('foo');
    expect(summary[1].samples).toHaveLength(2);
  });
});
