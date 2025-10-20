"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAjvInstance = createAjvInstance;
exports.compileSchema = compileSchema;
exports.validateSchema = validateSchema;
class PlaceholderAjv {
    compile(schema) {
        void schema;
        return () => true;
    }
}
function createAjvInstance() {
    return new PlaceholderAjv();
}
function compileSchema(schema, ajv = createAjvInstance()) {
    return ajv.compile(schema);
}
function validateSchema(schema, data) {
    const validator = compileSchema(schema);
    return validator(data);
}
