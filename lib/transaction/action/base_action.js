"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Action = void 0;
const util_1 = require("../../util");
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
        util_1.defineProperties(this, this.rlpSchema(), data);
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
    type() {
        return this.txType;
    }
    /**
     * Returns the action in JSON format
     * @see {@link https://github.com/ethereumjs/ethereumjs-util/blob/master/docs/index.md#defineproperties|ethereumjs-util}
     */
    toJSON(labels = false) {
        // Note: This never gets executed, defineProperties overwrites it.
        return {};
    }
}
exports.Action = Action;
