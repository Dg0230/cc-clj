"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultParserOptions = void 0;
exports.parseSource = parseSource;
const parser_1 = require("@babel/parser");
const defaultPlugins = [
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
    'exportNamespaceFrom',
];
exports.defaultParserOptions = {
    sourceType: 'module',
    plugins: defaultPlugins,
    allowReturnOutsideFunction: true,
    allowAwaitOutsideFunction: true,
    allowImportExportEverywhere: true,
};
function parseSource(code, options = exports.defaultParserOptions) {
    const parserOptions = {
        ...options,
        plugins: [...options.plugins],
    };
    return (0, parser_1.parse)(code, parserOptions);
}
