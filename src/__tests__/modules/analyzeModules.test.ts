import { analyzeBundleSource } from '../../modules/analyzeModules';

describe('analyzeBundleSource', () => {
  it('extracts module metadata from bundled factories', () => {
    const source = `
      const alpha = U((exports, module) => {
        exports.value = 'alpha';
      });

      const beta = U((exports) => {
        exports.compute = () => alpha();
        const label = `Beta: \${alpha.name}`;
        exports.label = label;
      });
    `;

    const results = analyzeBundleSource(source);
    expect(results).toHaveLength(2);
    const [alpha, beta] = results;
    expect(alpha.moduleId).toBe('alpha');
    expect(alpha.dependencies).toEqual([]);
    expect(alpha.exports[0]).toMatchObject({ type: 'assignment' });

    expect(beta.dependencies).toEqual(['alpha']);
    expect(beta.callIdentifiers).toEqual(expect.arrayContaining(['alpha']));
    expect(beta.stringLiterals).toEqual(expect.arrayContaining(['alpha', 'Beta: ']));
  });
});
