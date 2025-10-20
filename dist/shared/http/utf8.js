"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidUTF8 = isValidUTF8;
/**
 * UTF-8 validation helpers shared across HTTP modules.
 */
// TODO: Port UTF-8 validation logic from bundle module `rt`.
function isValidUTF8(input) {
    try {
        decodeURIComponent(escape(input));
        return true;
    }
    catch (error) {
        return false;
    }
}
