/**
 * Minimal representation of a Babel AST node. We only require the structural
 * information used by the generator along with the `start`/`end` offsets that
 * the analyzer preserves when parsing the original bundle.
 */
declare const require: (id: string) => unknown;

export interface BabelNode {
  type: string;
  start?: number | null;
  end?: number | null;
  [key: string]: unknown;
}

export interface JsescOptions {
  minimal?: boolean;
  [key: string]: unknown;
}

export interface GeneratorOptions {
  retainLines?: boolean;
  compact?: boolean | 'auto';
  concise?: boolean;
  comments?: boolean;
  decoratorsBeforeExport?: boolean;
  jsescOption?: JsescOptions;
  [key: string]: unknown;
}

export interface GeneratorResult {
  code: string;
  map: unknown;
  rawMappings?: unknown;
}

export interface GenerateCodeParams {
  ast: BabelNode;
  options?: GeneratorOptions;
  originalCode?: string;
}

type BabelGeneratorFunction = (ast: BabelNode, options?: GeneratorOptions, code?: string) => GeneratorResult;

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

const DEFAULT_OPTIONS: GeneratorOptions = {
  retainLines: false,
  compact: false,
  concise: false,
  comments: true,
  decoratorsBeforeExport: true,
  jsescOption: {
    minimal: true,
  },
};

function loadBabelGenerator(): BabelGeneratorFunction | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const loaded = require('@babel/generator') as
      | BabelGeneratorFunction
      | { default?: unknown };
    if (typeof loaded === 'function') {
      return loaded;
    }
    if (loaded && typeof loaded === 'object') {
      const maybeDefault = (loaded as { default?: unknown }).default;
      if (typeof maybeDefault === 'function') {
        return maybeDefault as BabelGeneratorFunction;
      }
    }
  } catch (error) {
    // The dependency is optional in the sandbox; fall back to the original source.
  }
  return null;
}

function mergeGeneratorOptions(options: GeneratorOptions = {}): GeneratorOptions {
  const merged: GeneratorOptions = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  if (DEFAULT_OPTIONS.jsescOption || options.jsescOption) {
    merged.jsescOption = {
      ...(DEFAULT_OPTIONS.jsescOption ?? {}),
      ...(options.jsescOption ?? {}),
    };
  }

  return merged;
}

function sliceFromOriginalCode(ast: BabelNode, originalCode?: string): string {
  if (typeof originalCode !== 'string') {
    throw new Error('`@babel/generator` is not available and no original code was provided.');
  }
  const start = typeof ast.start === 'number' && ast.start >= 0 ? ast.start : 0;
  const end = typeof ast.end === 'number' && ast.end >= 0 ? ast.end : originalCode.length;
  return originalCode.slice(start, end);
}

export function generateCode({ ast, options, originalCode }: GenerateCodeParams): GeneratorResult {
  const generator = loadBabelGenerator();
  const mergedOptions = mergeGeneratorOptions(options ?? {});
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
