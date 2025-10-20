"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultTransporter = exports.validate = exports.defaultErrorRedactor = exports.GAXIOS_ERROR_SYMBOL = exports.GaxiosError = exports.Gaxios = exports.pkg = void 0;
exports.request = request;
const pkg_1 = require("./internal/pkg");
Object.defineProperty(exports, "pkg", { enumerable: true, get: function () { return pkg_1.pkg; } });
const gaxios_1 = require("./internal/gaxios");
Object.defineProperty(exports, "Gaxios", { enumerable: true, get: function () { return gaxios_1.Gaxios; } });
Object.defineProperty(exports, "GaxiosError", { enumerable: true, get: function () { return gaxios_1.GaxiosError; } });
Object.defineProperty(exports, "GAXIOS_ERROR_SYMBOL", { enumerable: true, get: function () { return gaxios_1.GAXIOS_ERROR_SYMBOL; } });
Object.defineProperty(exports, "defaultErrorRedactor", { enumerable: true, get: function () { return gaxios_1.defaultErrorRedactor; } });
const validators_1 = require("./internal/validators");
Object.defineProperty(exports, "validate", { enumerable: true, get: function () { return validators_1.validate; } });
const transporter_1 = require("./internal/transporter");
Object.defineProperty(exports, "DefaultTransporter", { enumerable: true, get: function () { return transporter_1.DefaultTransporter; } });
function request(options) {
    return gaxios_1.Gaxios.instance.request(options);
}
