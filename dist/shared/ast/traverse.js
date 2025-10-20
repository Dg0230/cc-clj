"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.traverseAst = traverseAst;
function traverseAst(root, enter, parent = null) {
    if (!root || typeof root.type !== 'string') {
        return;
    }
    enter(root, parent);
    for (const key of Object.keys(root)) {
        if (key === 'loc' || key.endsWith('Comments')) {
            continue;
        }
        const value = Reflect.get(root, key);
        if (!value) {
            continue;
        }
        if (Array.isArray(value)) {
            for (const child of value) {
                if (child && typeof child.type === 'string') {
                    traverseAst(child, enter, root);
                }
            }
        }
        else if (typeof value.type === 'string') {
            traverseAst(value, enter, root);
        }
    }
}
