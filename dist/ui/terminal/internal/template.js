"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTemplate = parseTemplate;
function parseTemplate(template, ...substitutions) {
    const parts = [];
    template.forEach((segment, index) => {
        parts.push({ text: segment });
        if (index < substitutions.length) {
            parts.push({ text: String(substitutions[index]) });
        }
    });
    return parts;
}
