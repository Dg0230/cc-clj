"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCode = generateCode;
/**
 * The bundled CLI modules rely on a wide range of ECMAScript proposals—
 * class fields, private members, optional chaining, logical assignment, JSX, etc.
 * They are all supported by the parser configuration used in
 * `analyze-modules.js`. This helper attempts to load `@babel/generator` to turn
 * recovered AST back into readable source code. When the dependency is not
 * available (for example in the restricted execution environment used for
 * these kata exercises) we gracefully fall back to returning the original
 * source slice as a best-effort representation.
 */
const DEFAULT_OPTIONS = {
    retainLines: false,
    compact: false,
    concise: false,
    comments: true,
    decoratorsBeforeExport: true,
    jsescOption: {
        minimal: true,
    },
};
function loadBabelGenerator() {
    try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const loaded = require('@babel/generator');
        if (typeof loaded === 'function') {
            return loaded;
        }
        if (loaded && typeof loaded === 'object') {
            const maybeDefault = loaded.default;
            if (typeof maybeDefault === 'function') {
                return maybeDefault;
            }
        }
    }
    catch (error) {
        // The dependency is optional in the sandbox; fall back to the original source.
    }
    return null;
}
function mergeGeneratorOptions(options = {}) {
    var _a, _b;
    const merged = {
        ...DEFAULT_OPTIONS,
        ...options,
    };
    if (DEFAULT_OPTIONS.jsescOption || options.jsescOption) {
        merged.jsescOption = {
            ...((_a = DEFAULT_OPTIONS.jsescOption) !== null && _a !== void 0 ? _a : {}),
            ...((_b = options.jsescOption) !== null && _b !== void 0 ? _b : {}),
        };
    }
    return merged;
}
function sliceFromOriginalCode(ast, originalCode) {
    if (typeof originalCode !== 'string') {
        throw new Error('`@babel/generator` is not available and no original code was provided.');
    }
    const start = typeof ast.start === 'number' && ast.start >= 0 ? ast.start : 0;
    const end = typeof ast.end === 'number' && ast.end >= 0 ? ast.end : originalCode.length;
    return originalCode.slice(start, end);
}
function generateCode({ ast, options, originalCode }) {
    const generator = loadBabelGenerator();
    const mergedOptions = mergeGeneratorOptions(options !== null && options !== void 0 ? options : {});
    if (generator) {
        return generator(ast, mergedOptions, originalCode);
    }
    const code = sliceFromOriginalCode(ast, originalCode);
    return {
        code,
        map: null,
        rawMappings: null,
    };
}
