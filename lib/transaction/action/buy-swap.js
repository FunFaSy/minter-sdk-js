"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuySwapAction = void 0;
const util_1 = require("../../util");
const transaction_1 = require("../transaction");
const base_action_1 = require("./base_action");
/**
 *
 */
class BuySwapAction extends base_action_1.Action {
    constructor(params) {
        // Convert params to Buffers
        const _params = {
            coins: params.coins.map(item => new util_1.BN(item)),
            valueToBuy: new util_1.BN(params.valueToBuy),
            maximumValueToSell: new util_1.BN(params.maximumValueToSell),
        };
        super(_params);
        this.txType = transaction_1.TransactionType.BUY_SWAP_POOL;
    }
    rlpSchema() {
        return [
            {
                name: 'coins',
                allowZero: false,
                allowNonBinaryArray: true,
            },
            {
                name: 'valueToBuy',
                length: 32,
                allowLess: true,
            },
            {
                name: 'maximumValueToSell',
                length: 32,
                allowLess: true,
            }
        ];
    }
}
exports.BuySwapAction = BuySwapAction;
