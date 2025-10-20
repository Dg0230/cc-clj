const fs = require('node:fs');
const path = require('node:path');
const { parse } = require('@babel/parser');

const filePath = path.join(__dirname, 'cli-origin.js');
const code = fs.readFileSync(filePath, 'utf8');

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
    'exportDefaultFrom',
    'exportNamespaceFrom'
  ],
  allowReturnOutsideFunction: true,
  allowAwaitOutsideFunction: true,
  allowImportExportEverywhere: true
};

const ast = parse(code, parserOptions);

function traverseNode(node, enter, parent = null) {
  if (!node || typeof node.type !== 'string') {
    return;
  }
  enter(node, parent);
  for (const key of Object.keys(node)) {
    if (key === 'loc' || key === 'leadingComments' || key === 'trailingComments' || key === 'innerComments') continue;
    const value = node[key];
    if (!value) continue;
    if (Array.isArray(value)) {
      for (const child of value) {
        if (child && typeof child.type === 'string') {
          traverseNode(child, enter, node);
        }
      }
    } else if (value && typeof value.type === 'string') {
      traverseNode(value, enter, node);
    }
  }
}

function getParamName(param) {
  if (!param) return null;
  if (param.type === 'Identifier') return param.name;
  return null;
}

function isExportsIdentifier(node, exportsName) {
  return Boolean(exportsName && node && node.type === 'Identifier' && node.name === exportsName);
}

function isModuleExports(node, moduleName) {
  if (!moduleName || !node || node.type !== 'MemberExpression' || node.computed) return !1;
  const object = node.object;
  const property = node.property;
  return Boolean(object && property && object.type === 'Identifier' && object.name === moduleName && property.type === 'Identifier' && property.name === 'exports');
}

function isExportsTarget(node, exportsName, moduleName) {
  return isExportsIdentifier(node, exportsName) || isModuleExports(node, moduleName);
}

function snippetFromNode(node) {
  if (!node) return '';
  const raw = code.slice(node.start, node.end);
  const collapsed = raw.replace(/\s+/g, ' ').trim();
  if (collapsed.length > 200) {
    return `${collapsed.slice(0, 197)}...`;
  }
  return collapsed;
}

function getLocation(node) {
  if (!node || !node.loc) return null;
  return {
    line: node.loc.start.line,
    column: node.loc.start.column
  };
}

function analyzeFactory(factoryNode, moduleNames, exportsName, moduleName) {
  const dependencies = new Set();
  const exportStatements = [];
  const targetNode = factoryNode.type === 'ArrowFunctionExpression' ? factoryNode.body : factoryNode.body;

  traverseNode(targetNode, (node) => {
    if (node.type === 'CallExpression') {
      const callee = node.callee;
      if (callee && callee.type === 'Identifier' && moduleNames.has(callee.name) && callee.name !== exportsName && callee.name !== moduleName) {
        dependencies.add(callee.name);
      }
      const firstArg = node.arguments && node.arguments[0];
      if (firstArg && isExportsTarget(firstArg, exportsName, moduleName)) {
        exportStatements.push({
          type: 'call',
          callee: snippetFromNode(callee),
          code: snippetFromNode(node),
          loc: getLocation(node)
        });
      }
    } else if (node.type === 'AssignmentExpression') {
      const left = node.left;
      if (left.type === 'MemberExpression') {
        if (isExportsIdentifier(left.object, exportsName) || isModuleExports(left.object, moduleName) || isModuleExports(left, moduleName)) {
          exportStatements.push({
            type: 'assignment',
            target: snippetFromNode(left),
            code: snippetFromNode(node),
            loc: getLocation(node)
          });
        }
      } else if (left.type === 'Identifier' && left.name === exportsName) {
        exportStatements.push({
          type: 'assignment',
          target: left.name,
          code: snippetFromNode(node),
          loc: getLocation(node)
        });
      }
    }
  }, factoryNode);

  return {
    dependencies: Array.from(dependencies).sort(),
    exports: exportStatements
  };
}

const moduleDeclarators = [];

traverseNode(ast.program, (node, parent) => {
  if (node.type !== 'VariableDeclarator') return;
  if (!node.init || node.init.type !== 'CallExpression') return;
  const callee = node.init.callee;
  if (!callee || callee.type !== 'Identifier') return;
  if (callee.name !== 'U') return;
  if (!node.init.arguments || node.init.arguments.length === 0) return;
  const factory = node.init.arguments[0];
  if (!factory || (factory.type !== 'ArrowFunctionExpression' && factory.type !== 'FunctionExpression')) return;
  const id = node.id;
  if (!id || id.type !== 'Identifier') return;
  moduleDeclarators.push({
    idName: id.name,
    factoryNode: factory,
    declaratorNode: node
  });
});

const moduleNameSet = new Set(moduleDeclarators.map((item) => item.idName));

const results = moduleDeclarators.map((item) => {
  const exportsName = getParamName(item.factoryNode.params[0]);
  const moduleName = getParamName(item.factoryNode.params[1]);
  const analysis = analyzeFactory(item.factoryNode, moduleNameSet, exportsName, moduleName);
  return {
    moduleId: item.idName,
    location: getLocation(item.factoryNode),
    params: {
      exports: exportsName,
      module: moduleName
    },
    dependencies: analysis.dependencies,
    exports: analysis.exports
  };
});

const outputPath = path.join(__dirname, 'module-analysis.json');
fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
console.log(`Analysis written to ${outputPath}`);
