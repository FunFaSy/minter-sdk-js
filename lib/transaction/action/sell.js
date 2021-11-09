"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SellAction = void 0;
const util_1 = require("../../util");
const transaction_1 = require("../transaction");
const base_action_1 = require("./base_action");
/**
 *
 */
class SellAction extends base_action_1.Action {
    constructor(params) {
        // Convert params to Buffers
        const _params = {
            coinToSell: util_1.toBuffer(new util_1.BN(params.coinToSell)),
            valueToSell: util_1.toBuffer(new util_1.BN(params.valueToSell)),
            coinToBuy: util_1.toBuffer(new util_1.BN(params.coinToBuy)),
            minimumValueToBuy: util_1.toBuffer(new util_1.BN(params.minimumValueToBuy)),
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
