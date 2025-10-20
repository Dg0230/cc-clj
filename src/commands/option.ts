import { InvalidArgumentError } from './errors';

/**
 * Placeholder for the Commander `Option` implementation (bundle module `vs0`).
 */
// TODO(vs0): Port Option logic from cli-origin.js.
export type OptionParser<T> = (value: string, previous?: T) => T;

function splitFlags(flags: string): string[] {
  return flags
    .split(/[ ,|]+/)
    .map((flag) => flag.trim())
    .filter(Boolean);
}

export class Option<T = unknown> {
  public readonly flags: string;
  public readonly short?: string;
  public readonly long?: string;
  public description?: string;

  private _mandatory = false;
  private _variadic = false;
  private _defaultValue?: T | (() => T);
  private _parser?: OptionParser<T>;
  private _choices?: Set<T>;

  constructor(flags: string, description?: string) {
    this.flags = flags;
    this.description = description;

    const [shortFlag, longFlag] = splitFlags(flags);
    if (shortFlag?.startsWith('-') && !shortFlag.startsWith('--')) {
      this.short = shortFlag;
    }
    if (longFlag?.startsWith('--')) {
      this.long = longFlag;
    }
    if (flags.includes('...')) {
      this._variadic = true;
    }
  }

  public attributeName(): string {
    const nameFromLong = this.long?.replace(/^--/, '');
    const candidate = nameFromLong ?? this.short?.replace(/^-/, '') ?? this.flags;
    return candidate.replace(/-([a-z])/g, (_, char: string) => char.toUpperCase());
  }

  public isMandatory(): boolean {
    return this._mandatory;
  }

  public isVariadic(): boolean {
    return this._variadic;
  }

  public makeOptionMandatory(mandatory = true): this {
    this._mandatory = mandatory;
    return this;
  }

  public default(value: T | (() => T)): this {
    this._defaultValue = value;
    return this;
  }

  public argParser(parser: OptionParser<T>): this {
    this._parser = parser;
    return this;
  }

  public choices(values: readonly T[]): this {
    this._choices = new Set(values);
    return this;
  }

  public get defaultValue(): T | undefined {
    if (typeof this._defaultValue === 'function') {
      return (this._defaultValue as () => T)();
    }
    return this._defaultValue;
  }

  public parse(value: string, previous?: T): T {
    const parsed = this._parser ? this._parser(value, previous) : ((value as unknown) as T);
    if (this._choices && !this._choices.has(parsed)) {
      throw new InvalidArgumentError(`Invalid option value '${value}'.`);
    }
    return parsed;
  }
}
