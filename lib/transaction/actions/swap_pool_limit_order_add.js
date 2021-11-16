"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddLimitOrderAction = void 0;
const util_1 = require("../../util");
const internal_1 = require("../internal");
const action_1 = require("./action");
/**
 *
 */
class AddLimitOrderAction extends action_1.Action {
    constructor(data) {
        let _data = data;
        if (typeof data == 'object' && !Buffer.isBuffer(data)) {
            _data = {
                coinToSell: new util_1.BN(data?.coinToSell),
                valueToSell: new util_1.BN(data?.valueToSell),
                coinToBuy: new util_1.BN(data?.coinToBuy),
                valueToBuy: new util_1.BN(data?.valueToBuy),
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
                name: 'valueToBuy',
                length: 32,
                allowLess: true,
            },
        ];
    }
}
exports.AddLimitOrderAction = AddLimitOrderAction;
AddLimitOrderAction.txType = internal_1.TransactionType.ADD_LIMIT_ORDER;
