"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SellSwapAction = void 0;
const util_1 = require("../../util");
const internal_1 = require("../internal");
const action_1 = require("./action");
/**
 *
 */
class SellSwapAction extends action_1.Action {
    constructor(data) {
        let _data = data;
        if (typeof data == 'object' && !Buffer.isBuffer(data)) {
            _data = {
                coins: data.coins.map(item => new util_1.BN(item)),
                valueToSell: new util_1.BN(data.valueToSell),
                minimumValueToBuy: new util_1.BN(data.minimumValueToBuy),
            };
        }
        super(_data);
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
SellSwapAction.txType = internal_1.TransactionType.SELL_SWAP_POOL;
