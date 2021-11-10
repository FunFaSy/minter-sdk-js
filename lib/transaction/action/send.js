"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendAction = void 0;
const util_1 = require("../../util");
const transaction_1 = require("../transaction");
const base_action_1 = require("./base_action");
/**
 *
 */
class SendAction extends base_action_1.Action {
    constructor(params) {
        // Convert params to Buffers
        const _params = {
            coin: new util_1.BN(params.coin),
            value: new util_1.BN(params.value),
            to: util_1.toBuffer(params.to),
        };
        super(_params);
        this.txType = transaction_1.TransactionType.SEND;
    }
    rlpSchema() {
        return [
            {
                name: 'coin',
                length: 4,
                allowLess: true,
            },
            {
                name: 'to',
                length: 20,
            },
            {
                name: 'value',
                length: 32,
                allowLess: true,
            }
        ];
    }
}
exports.SendAction = SendAction;
