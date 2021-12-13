"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Action = void 0;
const define_properties_1 = __importDefault(require("../../util/define-properties"));
const util_1 = require("../../util");
/**
 *
 */
class Action {
    constructor(data) {
        /**
           * Returns the rlp encoding of the transaction
           * @method serialize
           * @return {Buffer}
           * @memberof Transaction
           * @name serialize
           */
        // attached serialize
        define_properties_1.default(this, this.rlpSchema(), data);
    }
    static constructorByType(type) {
        return undefined;
    }
    type() {
        const self = Object.getPrototypeOf(this).constructor;
        return self.txType;
    }
    /**
     *
     */
    getRaw() {
        return this.raw;
    }
    /**
     * Returns the rlp encoding of the action
     */
    encode() {
        return this.serialize();
    }
    /**
     * Returns the rlp encoding of the action
     */
    serialize() {
        // Note: This never gets executed, defineProperties overwrites it.
        return util_1.rlp.encode(this.raw);
    }
    /**
     * Return 0x prefixed hex of `serialise` method result
     */
    serializeToString() {
        // Note: This never gets executed, defineProperties overwrites it.
        return '';
    }
    /**
     * Returns the action in JSON format
     * @see {@link https://github.com/ethereumjs/ethereumjs-util/blob/master/docs/index.md#defineproperties|ethereumjs-util}
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    toJSON(labels = false) {
        // Note: This never gets executed, defineProperties overwrites it.
        return {};
    }
}
exports.Action = Action;
Action.txType = undefined;
