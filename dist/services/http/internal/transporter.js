"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultTransporter = void 0;
const gaxios_1 = require("./gaxios");
/**
 * Default transporter placeholder similar to Google auth client.
 */
// TODO: Port transporter behaviour from cli-origin.js bundle.
class DefaultTransporter {
    constructor(client = gaxios_1.Gaxios.instance) {
        this.client = client;
    }
    async request(options) {
        return this.client.request(options);
    }
}
exports.DefaultTransporter = DefaultTransporter;
