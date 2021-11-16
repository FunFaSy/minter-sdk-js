"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveLimitOrderAction = void 0;
const util_1 = require("../../util");
const internal_1 = require("../internal");
const action_1 = require("./action");
/**
 *
 */
class RemoveLimitOrderAction extends action_1.Action {
    constructor(data) {
        let _data = data;
        if (typeof data == 'object' && !Buffer.isBuffer(data)) {
            _data = {
                orderId: new util_1.BN(data.orderId),
            };
        }
        super(_data);
    }
    rlpSchema() {
        return [
            {
                name: 'orderId',
                length: 4,
                allowLess: true,
            },
        ];
    }
}
exports.RemoveLimitOrderAction = RemoveLimitOrderAction;
RemoveLimitOrderAction.txType = internal_1.TransactionType.REMOVE_LIMIT_ORDER;
