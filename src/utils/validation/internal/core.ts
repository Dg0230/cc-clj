/**
 * AJV core helpers placeholder derived from bundle modules `W50` and `I50`.
 */
// TODO: Wire up real AJV integration from cli-origin.js bundle.
export interface JsonSchema {
  readonly $id?: string;
  readonly type?: string;
  readonly properties?: Record<string, JsonSchema>;
}

export type Validator<T = unknown> = (data: T) => boolean;

export interface AjvInstance {
  compile<T>(schema: JsonSchema): Validator<T>;
}

class PlaceholderAjv implements AjvInstance {
  public compile<T>(schema: JsonSchema): Validator<T> {
    void schema;
    return () => true;
  }
}

export function createAjvInstance(): AjvInstance {
  return new PlaceholderAjv();
}

export function compileSchema<T>(schema: JsonSchema, ajv: AjvInstance = createAjvInstance()): Validator<T> {
  return ajv.compile<T>(schema);
}

export function validateSchema<T>(schema: JsonSchema, data: T): boolean {
  const validator = compileSchema<T>(schema);
  return validator(data);
}
