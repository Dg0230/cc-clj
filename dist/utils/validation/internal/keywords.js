"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formats = exports.keywords = void 0;
exports.keywords = [
    { keyword: 'example' },
];
exports.formats = {
    'date-time': (value) => !Number.isNaN(Date.parse(value)),
};
