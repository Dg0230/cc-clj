"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_ANALYSIS_OUTPUT_PATH = exports.DEFAULT_BUNDLE_PATH = void 0;
exports.analyzeBundleSource = analyzeBundleSource;
exports.analyzeCliBundle = analyzeCliBundle;
exports.writeAnalysisToFile = writeAnalysisToFile;
exports.analyzeAndWrite = analyzeAndWrite;
const node_path_1 = require("node:path");
const ast_1 = require("../shared/ast");
const io_1 = require("../shared/io");
exports.DEFAULT_BUNDLE_PATH = (0, node_path_1.join)(__dirname, '..', '..', 'cli-origin.js');
exports.DEFAULT_ANALYSIS_OUTPUT_PATH = (0, node_path_1.join)(__dirname, '..', '..', 'module-analysis.json');
function getParamName(param) {
    if (!param || param.type !== 'Identifier') {
        return null;
    }
    return param.name;
}
function isExportsIdentifier(node, exportsName) {
    return Boolean(exportsName && node && node.type === 'Identifier' && node.name === exportsName);
}
function isModuleExports(node, moduleName) {
    if (!moduleName || !node || node.type !== 'MemberExpression') {
        return false;
    }
    const expression = node;
    if (expression.computed) {
        return false;
    }
    const object = expression.object;
    const property = expression.property;
    return Boolean(object &&
        property &&
        object.type === 'Identifier' &&
        object.name === moduleName &&
        property.type === 'Identifier' &&
        property.name === 'exports');
}
function isExportsTarget(node, exportsName, moduleName) {
    return isExportsIdentifier(node, exportsName) || isModuleExports(node, moduleName);
}
function analyzeFactory(source, factoryNode, moduleNames, exportsName, moduleName) {
    const dependencies = new Set();
    const exportStatements = [];
    const stringLiterals = new Set();
    const callIdentifiers = new Set();
    const targetNode = factoryNode.body;
    (0, ast_1.traverseAst)(targetNode, (node, parent) => {
        var _a;
        if (node.type === 'CallExpression') {
            const call = node;
            const callee = call.callee;
            if (callee &&
                callee.type === 'Identifier' &&
                moduleNames.has(callee.name) &&
                callee.name !== exportsName &&
                callee.name !== moduleName) {
                dependencies.add(callee.name);
            }
            if (callee) {
                if (callee.type === 'Identifier') {
                    callIdentifiers.add(callee.name);
                }
                else if (callee.type === 'MemberExpression') {
                    const member = callee;
                    if (!member.computed && member.property.type === 'Identifier') {
                        const objectSnippet = member.object.type === 'Identifier'
                            ? member.object.name
                            : (0, ast_1.createSnippet)(source, member.object);
                        callIdentifiers.add(`${objectSnippet}.${member.property.name}`);
                    }
                }
            }
            const firstArg = call.arguments[0];
            if (firstArg && isExportsTarget(firstArg, exportsName, moduleName)) {
                exportStatements.push({
                    type: 'call',
                    callee: (0, ast_1.createSnippet)(source, callee),
                    code: (0, ast_1.createSnippet)(source, call),
                    loc: (0, ast_1.getNodeLocation)(call),
                });
            }
        }
        else if (node.type === 'AssignmentExpression') {
            const left = node.left;
            if ((left === null || left === void 0 ? void 0 : left.type) === 'MemberExpression') {
                const member = left;
                if (isExportsIdentifier(member.object, exportsName) || isModuleExports(member.object, moduleName) || isModuleExports(member, moduleName)) {
                    exportStatements.push({
                        type: 'assignment',
                        target: (0, ast_1.createSnippet)(source, member),
                        code: (0, ast_1.createSnippet)(source, node),
                        loc: (0, ast_1.getNodeLocation)(node),
                    });
                }
            }
            else if ((left === null || left === void 0 ? void 0 : left.type) === 'Identifier' && left.name === exportsName) {
                exportStatements.push({
                    type: 'assignment',
                    target: left.name,
                    code: (0, ast_1.createSnippet)(source, node),
                    loc: (0, ast_1.getNodeLocation)(node),
                });
            }
        }
        if (node.type === 'StringLiteral') {
            const literal = node;
            if (literal.value && literal.value.length <= 200) {
                stringLiterals.add(literal.value);
            }
        }
        else if (node.type === 'TemplateElement') {
            const template = node;
            const value = (_a = template.value) === null || _a === void 0 ? void 0 : _a.cooked;
            if (value && value.length <= 200) {
                stringLiterals.add(value);
            }
        }
    }, factoryNode);
    return {
        dependencies: Array.from(dependencies).sort(),
        exports: exportStatements,
        stringLiterals: Array.from(stringLiterals).slice(0, 25),
        callIdentifiers: Array.from(callIdentifiers).slice(0, 25),
    };
}
function collectModuleDeclarators(source) {
    const ast = (0, ast_1.parseSource)(source);
    const moduleDeclarators = [];
    (0, ast_1.traverseAst)(ast.program, (node, parent) => {
        if (node.type !== 'VariableDeclarator') {
            return;
        }
        const declarator = node;
        const init = declarator.init;
        if (!init || init.type !== 'CallExpression') {
            return;
        }
        const callee = init.callee;
        if (!callee || callee.type !== 'Identifier' || callee.name !== 'U') {
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
            idName: id.name,
            factoryNode: factory,
            declaratorNode: declarator,
        });
    }, ast.program);
    return moduleDeclarators;
}
function analyzeBundleSource(source) {
    const moduleDeclarators = collectModuleDeclarators(source);
    const moduleNameSet = new Set(moduleDeclarators.map((item) => item.idName));
    return moduleDeclarators.map((item) => {
        var _a, _b;
        const exportsName = getParamName((_a = item.factoryNode.params[0]) !== null && _a !== void 0 ? _a : null);
        const moduleName = getParamName((_b = item.factoryNode.params[1]) !== null && _b !== void 0 ? _b : null);
        const analysis = analyzeFactory(source, item.factoryNode, moduleNameSet, exportsName, moduleName);
        return {
            moduleId: item.idName,
            location: (0, ast_1.getNodeLocation)(item.factoryNode),
            params: {
                exports: exportsName,
                module: moduleName,
            },
            dependencies: analysis.dependencies,
            exports: analysis.exports,
            stringLiterals: analysis.stringLiterals,
            callIdentifiers: analysis.callIdentifiers,
        };
    });
}
function analyzeCliBundle(options = {}) {
    var _a;
    const bundlePath = (_a = options.bundlePath) !== null && _a !== void 0 ? _a : exports.DEFAULT_BUNDLE_PATH;
    const source = (0, io_1.readTextFile)(bundlePath);
    return analyzeBundleSource(source);
}
function writeAnalysisToFile(results, options = {}) {
    var _a;
    const outputPath = (_a = options.analysisOutputPath) !== null && _a !== void 0 ? _a : exports.DEFAULT_ANALYSIS_OUTPUT_PATH;
    (0, io_1.writeJsonFile)(outputPath, results);
    return outputPath;
}
function analyzeAndWrite(options = {}) {
    const results = analyzeCliBundle(options);
    const outputPath = writeAnalysisToFile(results, options);
    return { outputPath, results };
}
