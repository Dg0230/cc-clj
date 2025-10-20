"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNodeLocation = getNodeLocation;
exports.createSnippet = createSnippet;
function getNodeLocation(node) {
    const loc = node === null || node === void 0 ? void 0 : node.loc;
    if (!loc) {
        return null;
    }
    return {
        line: loc.start.line,
        column: loc.start.column,
    };
}
function createSnippet(source, node, maxLength = 200) {
    var _a, _b;
    if (!node) {
        return '';
    }
    const raw = source.slice((_a = node.start) !== null && _a !== void 0 ? _a : 0, (_b = node.end) !== null && _b !== void 0 ? _b : 0);
    const collapsed = raw.replace(/\s+/g, ' ').trim();
    if (collapsed.length > maxLength) {
        return `${collapsed.slice(0, Math.max(0, maxLength - 3))}...`;
    }
    return collapsed;
}
