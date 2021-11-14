"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveLimitOrderAction = void 0;
const util_1 = require("../../util");
const transaction_1 = require("../transaction");
const action_1 = require("./action");
/**
 *
 */
class RemoveLimitOrderAction extends action_1.Action {
    constructor(params) {
        // Convert params to Buffers
        const _params = {
            orderId: new util_1.BN(params.orderId)
        };
        super(_params);
        this.txType = transaction_1.TransactionType.REMOVE_LIMIT_ORDER;
    }
    rlpSchema() {
        return [
            {
                name: 'orderId',
                length: 4,
                allowLess: true,
            }
        ];
    }
}
exports.RemoveLimitOrderAction = RemoveLimitOrderAction;
