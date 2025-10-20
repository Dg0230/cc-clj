"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Argument = void 0;
exports.argument = argument;
exports.humanReadableArgName = humanReadableArgName;
const errors_1 = require("../../shared/cli/errors");
class Argument {
    constructor(_name, description) {
        this._name = _name;
        this._description = description;
    }
    name() {
        return this._name;
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
}
exports.Argument = Argument;
function argument(name, description) {
    return new Argument(name, description);
}
function humanReadableArgName(arg) {
    const name = arg.name();
    if (name.startsWith('<') || name.startsWith('[')) {
        return name;
    }
    const hasDefault = arg.defaultValue !== undefined;
    return hasDefault ? `[${name}]` : `<${name}>`;
}
