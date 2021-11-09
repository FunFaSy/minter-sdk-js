"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logWarning = void 0;
function logWarning(...args) {
    if (!process.env['MINTER_NO_LOGS']) {
        console.warn(...args);
    }
}
exports.logWarning = logWarning;
