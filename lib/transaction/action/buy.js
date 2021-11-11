"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuyAction = void 0;
const util_1 = require("../../util");
const transaction_1 = require("../transaction");
const base_action_1 = require("./base_action");
/**
 *
 */
class BuyAction extends base_action_1.Action {
    constructor(params) {
        // Convert params to Buffers
        const _params = {
            coinToBuy: new util_1.BN(params.coinToBuy),
            valueToBuy: new util_1.BN(params.valueToBuy),
            coinToSell: new util_1.BN(params.coinToSell),
            maximumValueToSell: new util_1.BN(params.maximumValueToSell),
        };
        super(_params);
        this.txType = transaction_1.TransactionType.BUY;
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
