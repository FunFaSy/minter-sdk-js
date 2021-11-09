'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
exports.Action = void 0;
const util_1 = require('../../util');
const send_1 = require('./send');

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

    static fromConfig(config) {
        switch (config.type.toLowerCase()) {
            case 'send':
                return new send_1.SendAction(config.params);
            default:
                throw new Error('Unsupported transaction type');
        }
    }

    encode() {
        return util_1.rlp.encode(this.raw);
    }

    type() {
        return this.txType;
    }
}

exports.Action = Action;
