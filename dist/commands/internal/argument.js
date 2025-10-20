"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Argument = void 0;
exports.argument = argument;
exports.humanReadableArgName = humanReadableArgName;
const errors_1 = require("../../shared/cli/errors");
function normalizeName(name) {
    const trimmed = name.trim();
    const required = trimmed.startsWith('<');
    const optional = trimmed.startsWith('[');
    const inner = trimmed.replace(/^[[<]/, '').replace(/[>\]]$/, '');
    const variadic = inner.endsWith('...');
    const baseName = variadic ? inner.slice(0, -3) : inner;
    return {
        baseName: baseName || trimmed,
        variadic,
        required: required || (!required && !optional),
    };
}
class Argument {
    constructor(name, description) {
        this._rawName = name;
        const normalized = normalizeName(name);
        this._name = normalized.baseName;
        this._required = normalized.required;
        this._variadic = normalized.variadic;
        this._description = description;
    }
    name() {
        return this._name;
    }
    rawName() {
        return this._rawName;
    }
    isRequired() {
        return this._required && !this._variadicOptionalFallback;
    }
    isOptional() {
        return !this.isRequired();
    }
    isVariadic() {
        return this._variadic;
    }
    description(description) {
        var _a;
        if (description === undefined) {
            return (_a = this._description) !== null && _a !== void 0 ? _a : '';
        }
        this._description = description;
        return this;
    }
    default(value) {
        this._defaultValue = value;
        return this;
    }
    argParser(parser) {
        this._parser = parser;
        return this;
    }
    choices(values) {
        this._choices = new Set(values);
        return this;
    }
    parse(value, previous) {
        const parsed = this._parser ? this._parser(value, previous) : value;
        if (this._choices && !this._choices.has(parsed)) {
            throw new errors_1.InvalidArgumentError(`Invalid argument value '${value}'.`);
        }
        return parsed;
    }
    get defaultValue() {
        if (typeof this._defaultValue === 'function') {
            return this._defaultValue();
        }
        return this._defaultValue;
    }
    get _variadicOptionalFallback() {
        return this._variadic && !this._required;
    }
}
exports.Argument = Argument;
function argument(name, description) {
    return new Argument(name, description);
}
function humanReadableArgName(arg) {
    const suffix = arg.isVariadic() ? '...' : '';
    const name = `${arg.name()}${suffix}`;
    return arg.isRequired() ? `<${name}>` : `[${name}]`;
}
