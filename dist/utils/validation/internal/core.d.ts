/**
 * AJV core helpers placeholder derived from bundle modules `W50` and `I50`.
 */
export interface JsonSchema {
    readonly $id?: string;
    readonly type?: string;
    readonly properties?: Record<string, JsonSchema>;
}
export type Validator<T = unknown> = (data: T) => boolean;
export interface AjvInstance {
    compile<T>(schema: JsonSchema): Validator<T>;
}
export declare function createAjvInstance(): AjvInstance;
export declare function compileSchema<T>(schema: JsonSchema, ajv?: AjvInstance): Validator<T>;
export declare function validateSchema<T>(schema: JsonSchema, data: T): boolean;
