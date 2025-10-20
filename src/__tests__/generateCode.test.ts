import { parse } from '@babel/parser';

import { generateCode } from '../shared/ast/generateCode';

const parserOptions = {
  sourceType: 'module',
  plugins: [
    'importMeta',
    'classProperties',
    'classPrivateProperties',
    'classPrivateMethods',
    'dynamicImport',
    'optionalChaining',
    'nullishCoalescingOperator',
    'numericSeparator',
    'topLevelAwait',
    'bigInt',
    'jsx',
    'logicalAssignment',
  ],
};

describe('generateCode', () => {
  it('generates readable output for modern syntax features', () => {
    const snippet = `
class Example {
  static #counter = 0;
  field = Example.#counter ?? 1;

  update(payload?: { value?: string }) {
    this.field ||= payload?.value ?? Example.#counter ?? 0;
    return this.field;
  }

  render() {
    return <section data-count={Example.#counter}>{this.field ?? 'n/a'}</section>;
  }
}

const config = {
  limit: 1_000,
  load: async () => {
    const module = await import('./module.js');
    return module?.default ?? module;
  },
};

await config.load?.();
`;

    const ast = parse(snippet, parserOptions);
    const { code } = generateCode({ ast: ast.program, originalCode: snippet });

    expect(code).toContain('static #counter = 0;');
    expect(code).toContain('this.field ||= payload?.value ?? Example.#counter ?? 0;');
    expect(code).toContain("<section data-count={Example.#counter}>{this.field ?? 'n/a'}</section>");
    expect(code).toContain('1_000');
    expect(code).toMatch(/await import\((['"])\.\/module\.js\1\);/);
  });
});
