"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SellAllAction = void 0;
const util_1 = require("../../util");
const transaction_1 = require("../transaction");
const base_action_1 = require("./base_action");
/**
 *
 */
class SellAllAction extends base_action_1.Action {
    constructor(params) {
        // Convert params to Buffers
        const _params = {
            coinToSell: new util_1.BN(params.coinToSell),
            coinToBuy: new util_1.BN(params.coinToBuy),
            minimumValueToBuy: new util_1.BN(params.minimumValueToBuy),
        };
        super(_params);
        this.txType = transaction_1.TransactionType.SELL_ALL;
    }
    rlpSchema() {
        return [
            {
                name: 'coinToSell',
                length: 4,
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
exports.SellAllAction = SellAllAction;
