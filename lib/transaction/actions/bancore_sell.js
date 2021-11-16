"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SellAction = void 0;
const util_1 = require("../../util");
const internal_1 = require("../internal");
const action_1 = require("./action");
/**
 *
 */
class SellAction extends action_1.Action {
    constructor(data) {
        let _data = data;
        if (typeof data == 'object' && !Buffer.isBuffer(data)) {
            _data = {
                coinToSell: new util_1.BN(data?.coinToSell),
                valueToSell: new util_1.BN(data?.valueToSell),
                coinToBuy: new util_1.BN(data?.coinToBuy),
                minimumValueToBuy: new util_1.BN(data?.minimumValueToBuy),
            };
        }
        super(_data);
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
SellAction.txType = internal_1.TransactionType.SELL;
