"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const errorHierarchy = __importStar(require("./errorHierarchy"));
const util_1 = require("../../util");
function subclass(BaseClass, classes, namespace = {}) {
    for (const [className, subclasses] of Object.entries(classes)) {
        const Class = Object.assign(namespace, {
            /*  By creating a named property, we trick compiler to assign our class constructor function a name.
                Otherwise, all our error constructors would be shown as [Function: Error] in the debugger! And
                the super-useful `e.constructor.name` magic wouldn't work — we then would have no chance to
                obtain a error type string from an error instance programmatically!                               */
            [className]: class extends BaseClass {
                constructor(message) {
                    super(message);
                    /*  A workaround to make `instanceof` work on custom Error classes in transpiled ES5.
                        See my blog post for the explanation of this hack:
                        https://medium.com/@xpl/javascript-deriving-from-error-properly-8d2f8f315801        */
                    this.constructor = Class;
                    this.__proto__ = Class.prototype;
                    this.name = className;
                    this.message = message;
                    // https://github.com/Microsoft/TypeScript/wiki/FAQ#why-doesnt-extending-built-ins-like-error-array-and-map-work
                    Object.setPrototypeOf(this, Class.prototype);
                }
            },
        })[className];
        subclass(Class, subclasses, namespace);
    }
    return namespace;
}
exports.default = subclass(
// Root class
util_1.TypedError, 
// Derived class hierarchy
errorHierarchy);
