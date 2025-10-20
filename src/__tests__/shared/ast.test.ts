import { parseSource, traverseAst, createSnippet, getNodeLocation } from '../../shared/ast';

describe('shared ast utilities', () => {
  const source = `
    export function greet(name) {
      const message = 'Hello ' + name.trim();
      return message.toUpperCase();
    }
  `;

  it('parses source using default options', () => {
    const ast = parseSource(source);
    expect(ast.program.body).toHaveLength(1);
  });

  it('traverses nodes depth-first', () => {
    const ast = parseSource(source);
    const types: string[] = [];
    traverseAst(ast.program, (node) => {
      types.push(node.type);
    });
    expect(types).toEqual(expect.arrayContaining(['FunctionDeclaration', 'ReturnStatement', 'CallExpression']));
  });

  it('produces snippets and locations from nodes', () => {
    const ast = parseSource(source);
    let firstCall: any = null;
    traverseAst(ast.program, (node) => {
      if (!firstCall && node.type === 'CallExpression') {
        firstCall = node;
      }
    });

    expect(firstCall).not.toBeNull();
    const snippet = createSnippet(source, firstCall);
    expect(snippet).toContain('name.trim');
    const location = getNodeLocation(firstCall);
    expect(location).toEqual({ line: 3, column: 12 });
  });
});
