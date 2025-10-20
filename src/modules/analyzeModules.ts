import { join } from 'node:path';

import type {
  ArrowFunctionExpression,
  CallExpression,
  FunctionExpression,
  Identifier,
  MemberExpression,
  Node,
  StringLiteral,
  TemplateElement,
  VariableDeclarator,
} from '@babel/types';

import {
  createSnippet,
  getNodeLocation,
  parseSource,
  traverseAst,
  type NodeLocation,
} from '../shared/ast';
import { readTextFile, writeJsonFile } from '../shared/io';
import type { ExportStatement, ModuleAnalysisResult } from '../shared/types';

export interface ModuleAnalysisOptions {
  readonly bundlePath?: string;
  readonly analysisOutputPath?: string;
}

export const DEFAULT_BUNDLE_PATH = join(__dirname, '..', '..', 'cli-origin.js');
export const DEFAULT_ANALYSIS_OUTPUT_PATH = join(__dirname, '..', '..', 'module-analysis.json');

type ModuleFactory = ArrowFunctionExpression | FunctionExpression;

interface ModuleDeclarator {
  readonly idName: string;
  readonly factoryNode: ModuleFactory;
  readonly declaratorNode: VariableDeclarator;
}

function getParamName(param: Node | null | undefined): string | null {
  if (!param || param.type !== 'Identifier') {
    return null;
  }
  return (param as Identifier).name;
}

function isExportsIdentifier(node: Node | null | undefined, exportsName: string | null): node is Identifier {
  return Boolean(exportsName && node && node.type === 'Identifier' && (node as Identifier).name === exportsName);
}

function isModuleExports(node: Node | null | undefined, moduleName: string | null): node is MemberExpression {
  if (!moduleName || !node || node.type !== 'MemberExpression') {
    return false;
  }
  const expression = node as MemberExpression;
  if (expression.computed) {
    return false;
  }
  const object = expression.object;
  const property = expression.property;
  return Boolean(
    object &&
      property &&
      object.type === 'Identifier' &&
      (object as Identifier).name === moduleName &&
      property.type === 'Identifier' &&
      (property as Identifier).name === 'exports',
  );
}

function isExportsTarget(node: Node | null | undefined, exportsName: string | null, moduleName: string | null): boolean {
  return isExportsIdentifier(node, exportsName) || isModuleExports(node, moduleName);
}

function analyzeFactory(
  source: string,
  factoryNode: ModuleFactory,
  moduleNames: ReadonlySet<string>,
  exportsName: string | null,
  moduleName: string | null,
): {
  readonly dependencies: readonly string[];
  readonly exports: readonly ExportStatement[];
  readonly stringLiterals: readonly string[];
  readonly callIdentifiers: readonly string[];
} {
  const dependencies = new Set<string>();
  const exportStatements: ExportStatement[] = [];
  const stringLiterals = new Set<string>();
  const callIdentifiers = new Set<string>();

  const targetNode = factoryNode.body;

  traverseAst(targetNode as Node, (node, parent) => {
    if (node.type === 'CallExpression') {
      const call = node as CallExpression;
      const callee = call.callee;
      if (
        callee &&
        callee.type === 'Identifier' &&
        moduleNames.has((callee as Identifier).name) &&
        (callee as Identifier).name !== exportsName &&
        (callee as Identifier).name !== moduleName
      ) {
        dependencies.add((callee as Identifier).name);
      }
      if (callee) {
        if (callee.type === 'Identifier') {
          callIdentifiers.add((callee as Identifier).name);
        } else if (callee.type === 'MemberExpression') {
          const member = callee as MemberExpression;
          if (!member.computed && member.property.type === 'Identifier') {
            const objectSnippet =
              member.object.type === 'Identifier'
                ? (member.object as Identifier).name
                : createSnippet(source, member.object);
            callIdentifiers.add(`${objectSnippet}.${(member.property as Identifier).name}`);
          }
        }
      }
      const firstArg = call.arguments[0] as Node | undefined;
      if (firstArg && isExportsTarget(firstArg, exportsName, moduleName)) {
        exportStatements.push({
          type: 'call',
          callee: createSnippet(source, callee as Node | undefined),
          code: createSnippet(source, call),
          loc: getNodeLocation(call),
        });
      }
    } else if (node.type === 'AssignmentExpression') {
      const left = (node as any).left as Node | undefined;
      if (left?.type === 'MemberExpression') {
        const member = left as MemberExpression;
        if (isExportsIdentifier(member.object, exportsName) || isModuleExports(member.object, moduleName) || isModuleExports(member, moduleName)) {
          exportStatements.push({
            type: 'assignment',
            target: createSnippet(source, member),
            code: createSnippet(source, node),
            loc: getNodeLocation(node),
          });
        }
      } else if (left?.type === 'Identifier' && (left as Identifier).name === exportsName) {
        exportStatements.push({
          type: 'assignment',
          target: (left as Identifier).name,
          code: createSnippet(source, node),
          loc: getNodeLocation(node),
        });
      }
    }

    if (node.type === 'StringLiteral') {
      const literal = node as StringLiteral;
      if (literal.value && literal.value.length <= 200) {
        stringLiterals.add(literal.value);
      }
    } else if (node.type === 'TemplateElement') {
      const template = node as TemplateElement;
      const value = template.value?.cooked;
      if (value && value.length <= 200) {
        stringLiterals.add(value);
      }
    }
  }, factoryNode as Node);

  return {
    dependencies: Array.from(dependencies).sort(),
    exports: exportStatements,
    stringLiterals: Array.from(stringLiterals).slice(0, 25),
    callIdentifiers: Array.from(callIdentifiers).slice(0, 25),
  };
}

function collectModuleDeclarators(source: string): ModuleDeclarator[] {
  const ast = parseSource(source);
  const moduleDeclarators: ModuleDeclarator[] = [];

  traverseAst(ast.program as Node, (node, parent) => {
    if (node.type !== 'VariableDeclarator') {
      return;
    }
    const declarator = node as VariableDeclarator;
    const init = declarator.init;
    if (!init || init.type !== 'CallExpression') {
      return;
    }
    const callee = init.callee;
    if (!callee || callee.type !== 'Identifier' || (callee as Identifier).name !== 'U') {
      return;
    }
    if (init.arguments.length === 0) {
      return;
    }
    const factory = init.arguments[0];
    if (!factory || (factory.type !== 'ArrowFunctionExpression' && factory.type !== 'FunctionExpression')) {
      return;
    }
    const id = declarator.id;
    if (!id || id.type !== 'Identifier') {
      return;
    }

    moduleDeclarators.push({
      idName: (id as Identifier).name,
      factoryNode: factory as ModuleFactory,
      declaratorNode: declarator,
    });
  }, ast.program as Node);

  return moduleDeclarators;
}

export function analyzeBundleSource(source: string): ModuleAnalysisResult[] {
  const moduleDeclarators = collectModuleDeclarators(source);
  const moduleNameSet = new Set(moduleDeclarators.map((item) => item.idName));

  return moduleDeclarators.map((item) => {
    const exportsName = getParamName((item.factoryNode.params[0] as Node | undefined) ?? null);
    const moduleName = getParamName((item.factoryNode.params[1] as Node | undefined) ?? null);
    const analysis = analyzeFactory(source, item.factoryNode, moduleNameSet, exportsName, moduleName);
    return {
      moduleId: item.idName,
      location: getNodeLocation(item.factoryNode) as NodeLocation | null,
      params: {
        exports: exportsName,
        module: moduleName,
      },
      dependencies: analysis.dependencies,
      exports: analysis.exports,
      stringLiterals: analysis.stringLiterals,
      callIdentifiers: analysis.callIdentifiers,
    } satisfies ModuleAnalysisResult;
  });
}

export function analyzeCliBundle(options: ModuleAnalysisOptions = {}): ModuleAnalysisResult[] {
  const bundlePath = options.bundlePath ?? DEFAULT_BUNDLE_PATH;
  const source = readTextFile(bundlePath);
  return analyzeBundleSource(source);
}

export function writeAnalysisToFile(results: readonly ModuleAnalysisResult[], options: ModuleAnalysisOptions = {}): string {
  const outputPath = options.analysisOutputPath ?? DEFAULT_ANALYSIS_OUTPUT_PATH;
  writeJsonFile(outputPath, results);
  return outputPath;
}

export function analyzeAndWrite(options: ModuleAnalysisOptions = {}): { readonly outputPath: string; readonly results: readonly ModuleAnalysisResult[] } {
  const results = analyzeCliBundle(options);
  const outputPath = writeAnalysisToFile(results, options);
  return { outputPath, results };
}
