"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorContext = exports.TypedError = void 0;
const types_1 = require("./types");
class TypedError extends Error {
    constructor(message, type, context) {
        super(message);
        this.type = type || 'UntypedError';
        this.context = context;
    }
}
exports.TypedError = TypedError;
class ErrorContext extends types_1.Assignable {
}
exports.ErrorContext = ErrorContext;
