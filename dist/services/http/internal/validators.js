"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
/**
 * Request validation helpers inspired by gaxios bundle module `Yd2`.
 */
// TODO: Port HTTP validation rules from cli-origin.js bundle.
function validate(url) {
    if (!/^https?:\/\//.test(url)) {
        throw new Error(`Invalid URL: ${url}`);
    }
}
