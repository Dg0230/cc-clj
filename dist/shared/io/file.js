"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readTextFile = readTextFile;
exports.writeTextFile = writeTextFile;
exports.readJsonFile = readJsonFile;
exports.writeJsonFile = writeJsonFile;
const node_fs_1 = require("node:fs");
function readTextFile(path) {
    return (0, node_fs_1.readFileSync)(path, 'utf8');
}
function writeTextFile(path, contents) {
    (0, node_fs_1.writeFileSync)(path, contents, 'utf8');
}
function readJsonFile(path) {
    const text = readTextFile(path);
    return JSON.parse(text);
}
function writeJsonFile(path, value) {
    const text = JSON.stringify(value, null, 2);
    writeTextFile(path, `${text}\n`);
}
