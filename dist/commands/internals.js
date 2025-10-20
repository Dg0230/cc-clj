"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTokens = parseTokens;
const errors_1 = require("./errors");
function parseTokens(tokens, knownOptions, allowUnknown = false) {
    const operands = [];
    const unknown = [];
    const optionValues = {};
    const findOption = (flag) => {
        return knownOptions.find((option) => option.short === flag || option.long === flag);
    };
    for (let index = 0; index < tokens.length; index += 1) {
        const token = tokens[index];
        if (!token.startsWith('-') || token === '-') {
            operands.push(token);
            continue;
        }
        const option = findOption(token);
        if (!option) {
            if (allowUnknown) {
                unknown.push(token);
                continue;
            }
            throw new errors_1.CommanderError('commander.unknownOption', 1, `Unknown option '${token}'.`);
        }
        let valueToken;
        if (option.isVariadic()) {
            const remaining = tokens.slice(index + 1);
            valueToken = remaining.join(' ');
            index = tokens.length;
        }
        else if (tokens[index + 1] && !tokens[index + 1].startsWith('-')) {
            valueToken = tokens[index + 1];
            index += 1;
        }
        const previousValue = optionValues[option.attributeName()];
        const parsed = option.parse(valueToken !== null && valueToken !== void 0 ? valueToken : 'true', previousValue);
        optionValues[option.attributeName()] = parsed;
    }
    return { operands, unknown, optionValues };
}
