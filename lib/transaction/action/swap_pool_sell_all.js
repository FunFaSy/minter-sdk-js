"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SellAllSwapAction = void 0;
const util_1 = require("../../util");
const transaction_1 = require("../transaction");
const action_1 = require("./action");
/**
 *
 */
class SellAllSwapAction extends action_1.Action {
    constructor(params) {
        // Convert params to Buffers
        const _params = {
            coins: params.coins.map(item => new util_1.BN(item)),
            minimumValueToBuy: new util_1.BN(params.minimumValueToBuy),
        };
        super(_params);
    }
    rlpSchema() {
        return [
            {
                name: 'coins',
                allowNonBinaryArray: true,
            },
            {
                name: 'minimumValueToBuy',
                length: 32,
                allowLess: true,
            }
        ];
    }
}
exports.SellAllSwapAction = SellAllSwapAction;
SellAllSwapAction.txType = transaction_1.TransactionType.SELL_ALL_SWAP_POOL;
