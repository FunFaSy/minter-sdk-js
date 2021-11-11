"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BurnTokenAction = void 0;
const util_1 = require("../../util");
const transaction_1 = require("../transaction");
const base_action_1 = require("./base_action");
/**
 *
 */
class BurnTokenAction extends base_action_1.Action {
    constructor(params) {
        // Convert params to Buffers
        const _params = {
            coin: new util_1.BN(params.coin),
            value: new util_1.BN(params.value),
        };
        super(_params);
        this.txType = transaction_1.TransactionType.BURN_TOKEN;
    }
    rlpSchema() {
        return [
            {
                name: 'coin',
                length: 4,
                allowLess: true,
            },
            {
                name: 'value',
                length: 32,
                allowLess: true,
            }
        ];
    }
}
exports.BurnTokenAction = BurnTokenAction;
