"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SellAction = void 0;
const util_1 = require("../../util");
const transaction_1 = require("../transaction");
const action_1 = require("./action");
/**
 *
 */
class SellAction extends action_1.Action {
    constructor(params) {
        // Convert params to Buffers
        const _params = {
            coinToSell: new util_1.BN(params.coinToSell),
            valueToSell: new util_1.BN(params.valueToSell),
            coinToBuy: new util_1.BN(params.coinToBuy),
            minimumValueToBuy: new util_1.BN(params.minimumValueToBuy),
        };
        super(_params);
        this.txType = transaction_1.TransactionType.SELL;
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
                name: 'minimumValueToBuy',
                length: 32,
                allowLess: true,
            }
        ];
    }
}
exports.SellAction = SellAction;
