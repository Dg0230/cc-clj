"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChalkFactory = exports.DEFAULT_THEME = void 0;
exports.toJson = toJson;
exports.fromJson = fromJson;
exports.DEFAULT_THEME = { enabled: true };
class ChalkFactory {
    constructor(theme = exports.DEFAULT_THEME) {
        this.theme = theme;
    }
    template(template, ...substitutions) {
        return template.raw ? [{ text: template.raw.join('') }] : substitutions.map((value) => ({ text: String(value) }));
    }
    withTheme(theme) {
        return new ChalkFactory(theme);
    }
}
exports.ChalkFactory = ChalkFactory;
function toJson(theme) {
    return JSON.stringify(theme);
}
function fromJson(serialized) {
    try {
        return JSON.parse(serialized);
    }
    catch (error) {
        return exports.DEFAULT_THEME;
    }
}
