import { InvalidArgumentError } from '../../shared/cli/errors';

/**
 * Placeholder for the Commander `Argument` implementation (bundle module `He1`).
 */
// TODO(He1): Port Argument behaviour from cli-origin.js.
export type ArgumentParser<T> = (value: string, previous?: T) => T;

function normalizeName(name: string): { baseName: string; variadic: boolean; required: boolean } {
  const trimmed = name.trim();
  const required = trimmed.startsWith('<');
  const optional = trimmed.startsWith('[');
  const inner = trimmed.replace(/^[[<]/, '').replace(/[>\]]$/, '');
  const variadic = inner.endsWith('...');
  const baseName = variadic ? inner.slice(0, -3) : inner;
  return {
    baseName: baseName || trimmed,
    variadic,
    required: required || (!required && !optional),
  };
}

export class Argument<T = unknown> {
  private readonly _rawName: string;
  private readonly _name: string;
  private readonly _required: boolean;
  private readonly _variadic: boolean;
  private _description?: string;
  private _defaultValue?: T | (() => T);
  private _parser?: ArgumentParser<T>;
  private _choices?: Set<T>;

  constructor(name: string, description?: string) {
    this._rawName = name;
    const normalized = normalizeName(name);
    this._name = normalized.baseName;
    this._required = normalized.required;
    this._variadic = normalized.variadic;
    this._description = description;
  }

  public name(): string {
    return this._name;
  }

  public rawName(): string {
    return this._rawName;
  }

  public isRequired(): boolean {
    return this._required && !this._variadicOptionalFallback;
  }

  public isOptional(): boolean {
    return !this.isRequired();
  }

  public isVariadic(): boolean {
    return this._variadic;
  }

  public description(description?: string): string | this {
    if (description === undefined) {
      return this._description ?? '';
    }
    this._description = description;
    return this;
  }

  public default(value: T | (() => T)): this {
    this._defaultValue = value;
    return this;
  }

  public argParser(parser: ArgumentParser<T>): this {
    this._parser = parser;
    return this;
  }

  public choices(values: readonly T[]): this {
    this._choices = new Set(values);
    return this;
  }

  public parse(value: string, previous?: T): T {
    const parsed = this._parser ? this._parser(value, previous) : ((value as unknown) as T);
    if (this._choices && !this._choices.has(parsed)) {
      throw new InvalidArgumentError(`Invalid argument value '${value}'.`);
    }
    return parsed;
  }

  public get defaultValue(): T | undefined {
    if (typeof this._defaultValue === 'function') {
      return (this._defaultValue as () => T)();
    }
    return this._defaultValue;
  }

  private get _variadicOptionalFallback(): boolean {
    return this._variadic && !this._required;
  }
}

export function argument<T = unknown>(name: string, description?: string): Argument<T> {
  return new Argument<T>(name, description);
}

export function humanReadableArgName(arg: Argument): string {
  const suffix = arg.isVariadic() ? '...' : '';
  const name = `${arg.name()}${suffix}`;
  return arg.isRequired() ? `<${name}>` : `[${name}]`;
}
