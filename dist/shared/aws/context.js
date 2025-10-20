"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.smithyContext = void 0;
exports.createSmithyContext = createSmithyContext;
function createSmithyContext(namespaces = {}) {
    return { namespaces: { ...namespaces } };
}
exports.smithyContext = createSmithyContext();
