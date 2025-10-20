import { InvalidArgumentError } from './errors';

/**
 * Placeholder for the Commander `Argument` implementation (bundle module `He1`).
 */
// TODO(He1): Port Argument behaviour from cli-origin.js.
export type ArgumentParser<T> = (value: string, previous?: T) => T;

export class Argument<T = unknown> {
  private _description?: string;
  private _defaultValue?: T | (() => T);
  private _parser?: ArgumentParser<T>;
  private _choices?: Set<T>;

  constructor(private readonly _name: string, description?: string) {
    this._description = description;
  }

  public name(): string {
    return this._name;
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
}

export function argument<T = unknown>(name: string, description?: string): Argument<T> {
  return new Argument<T>(name, description);
}
