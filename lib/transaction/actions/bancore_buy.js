"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuyAction = void 0;
const util_1 = require("../../util");
const internal_1 = require("../internal");
const action_1 = require("./action");
/**
 *
 */
class BuyAction extends action_1.Action {
    constructor(data) {
        let _data = data;
        if (typeof data == 'object' && !Buffer.isBuffer(data)) {
            _data = {
                coinToBuy: new util_1.BN(data?.coinToBuy),
                valueToBuy: new util_1.BN(data?.valueToBuy),
                coinToSell: new util_1.BN(data?.coinToSell),
                maximumValueToSell: new util_1.BN(data?.maximumValueToSell),
            };
        }
        super(_data);
    }
    rlpSchema() {
        return [
            {
                name: 'coinToBuy',
                length: 4,
                allowLess: true,
            },
            {
                name: 'valueToBuy',
                length: 32,
                allowLess: true,
            },
            {
                name: 'coinToSell',
                length: 4,
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
exports.BuyAction = BuyAction;
BuyAction.txType = internal_1.TransactionType.BUY;
