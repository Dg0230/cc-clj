"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBlob = isBlob;
exports.isValidStatusCode = isValidStatusCode;
exports.isValidUTF8 = isValidUTF8;
const utf8_1 = require("../../../shared/http/utf8");
function isBlob(value) {
    return typeof value === 'object' && value !== null && 'size' in value;
}
function isValidStatusCode(code) {
    return Number.isInteger(code) && code >= 100 && code <= 599;
}
function isValidUTF8(value) {
    return (0, utf8_1.isValidUTF8)(value);
}
