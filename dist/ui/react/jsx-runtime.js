"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fragment = void 0;
exports.jsx = jsx;
exports.jsxs = jsxs;
const runtime_1 = require("./runtime");
Object.defineProperty(exports, "Fragment", { enumerable: true, get: function () { return runtime_1.Fragment; } });
function jsx(type, props, key) {
    return (0, runtime_1.createElement)(type, { ...props, key }, props.children);
}
function jsxs(type, props, key) {
    return (0, runtime_1.createElement)(type, { ...props, key }, props.children);
}
