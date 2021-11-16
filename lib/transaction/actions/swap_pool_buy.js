"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuySwapAction = void 0;
const util_1 = require("../../util");
const internal_1 = require("../internal");
const action_1 = require("./action");
/**
 *
 */
class BuySwapAction extends action_1.Action {
    constructor(data) {
        let _data = data;
        if (typeof data == 'object' && !Buffer.isBuffer(data)) {
            _data = {
                coins: data.coins.map(item => new util_1.BN(item)),
                valueToBuy: new util_1.BN(data.valueToBuy),
                maximumValueToSell: new util_1.BN(data.maximumValueToSell),
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
BuySwapAction.txType = internal_1.TransactionType.BUY_SWAP_POOL;
