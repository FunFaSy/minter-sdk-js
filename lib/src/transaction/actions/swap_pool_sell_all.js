"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SellAllSwapAction = void 0;
const util_1 = require("../../util");
const internal_1 = require("../internal");
const action_1 = require("./action");
/**
 *
 */
class SellAllSwapAction extends action_1.Action {
    constructor(data) {
        let _data = data;
        if (typeof data == 'object' && !Buffer.isBuffer(data)) {
            _data = {
                coins: data.coins.map(item => new util_1.BN(item)),
                minimumValueToBuy: new util_1.BN(data.minimumValueToBuy),
            };
        }
        super(_data);
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
SellAllSwapAction.txType = internal_1.TransactionType.SELL_ALL_SWAP_POOL;
