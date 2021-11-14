"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SellSwapAction = void 0;
const util_1 = require("../../util");
const transaction_1 = require("../transaction");
const action_1 = require("./action");
/**
 *
 */
class SellSwapAction extends action_1.Action {
    constructor(params) {
        // Convert params to Buffers
        const _params = {
            coins: params.coins.map(item => new util_1.BN(item)),
            valueToSell: new util_1.BN(params.valueToSell),
            minimumValueToBuy: new util_1.BN(params.minimumValueToBuy),
        };
        super(_params);
        this.txType = transaction_1.TransactionType.SELL_SWAP_POOL;
    }
    rlpSchema() {
        return [
            {
                name: 'coins',
                allowZero: false,
                allowNonBinaryArray: true,
            },
            {
                name: 'valueToSell',
                length: 32,
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
exports.SellSwapAction = SellSwapAction;
