"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendAction = void 0;
const util_1 = require("../../util");
const transaction_1 = require("../transaction");
const action_1 = require("./action");
/**
 *
 */
class SendAction extends action_1.Action {
    constructor(params) {
        // Convert params to Buffers
        const _params = {
            coin: new util_1.BN(params.coin),
            value: new util_1.BN(params.value),
            to: util_1.toBuffer(params.to),
        };
        super(_params);
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
SendAction.txType = transaction_1.TransactionType.SEND;
