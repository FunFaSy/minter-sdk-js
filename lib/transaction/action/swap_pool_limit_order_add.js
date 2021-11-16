"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddLimitOrderAction = void 0;
const util_1 = require("../../util");
const transaction_1 = require("../transaction");
const action_1 = require("./action");
/**
 *
 */
class AddLimitOrderAction extends action_1.Action {
    constructor(params) {
        // Convert params to Buffers
        const _params = {
            coinToSell: new util_1.BN(params.coinToSell),
            valueToSell: new util_1.BN(params.valueToSell),
            coinToBuy: new util_1.BN(params.coinToBuy),
            valueToBuy: new util_1.BN(params.valueToBuy),
        };
        super(_params);
    }
    rlpSchema() {
        return [
            {
                name: 'coinToSell',
                length: 4,
                allowLess: true,
            },
            {
                name: 'valueToSell',
                length: 32,
                allowLess: true,
            },
            {
                name: 'coinToBuy',
                length: 4,
                allowLess: true,
            },
            {
                name: 'valueToBuy',
                length: 32,
                allowLess: true,
            },
        ];
    }
}
exports.AddLimitOrderAction = AddLimitOrderAction;
AddLimitOrderAction.txType = transaction_1.TransactionType.ADD_LIMIT_ORDER;
