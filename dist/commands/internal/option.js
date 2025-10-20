"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DualOptions = exports.Option = void 0;
const errors_1 = require("../../shared/cli/errors");
function splitFlags(flags) {
    return flags
        .split(/[ ,|]+/)
        .map((flag) => flag.trim())
        .filter(Boolean);
}
class Option {
    constructor(flags, description) {
        this._mandatory = false;
        this._variadic = false;
        this.flags = flags;
        this.description = description;
        const flagParts = splitFlags(flags);
        for (const part of flagParts) {
            if (part.startsWith('--')) {
                this.long = part;
            }
            else if (part.startsWith('-')) {
                this.short = part;
            }
        }
        if (flags.includes('...')) {
            this._variadic = true;
        }
    }
    attributeName() {
        var _a, _b, _c;
        const nameFromLong = (_a = this.long) === null || _a === void 0 ? void 0 : _a.replace(/^--/, '');
        const candidate = (_c = nameFromLong !== null && nameFromLong !== void 0 ? nameFromLong : (_b = this.short) === null || _b === void 0 ? void 0 : _b.replace(/^-/, '')) !== null && _c !== void 0 ? _c : this.flags;
        return candidate.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
    }
    isMandatory() {
        return this._mandatory;
    }
    isVariadic() {
        return this._variadic;
    }
    makeOptionMandatory(mandatory = true) {
        this._mandatory = mandatory;
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
    get defaultValue() {
        if (typeof this._defaultValue === 'function') {
            return this._defaultValue();
        }
        return this._defaultValue;
    }
    parse(value, previous) {
        const parsed = this._parser ? this._parser(value, previous) : value;
        if (this._choices && !this._choices.has(parsed)) {
            throw new errors_1.InvalidArgumentError(`Invalid option value '${value}'.`);
        }
        return parsed;
    }
}
exports.Option = Option;
class DualOptions {
    constructor(positive, negative) {
        this.positive = positive;
        this.negative = negative;
    }
    all() {
        return [this.positive, this.negative];
    }
}
exports.DualOptions = DualOptions;
