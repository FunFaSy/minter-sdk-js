"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MintTokenAction = void 0;
const util_1 = require("../../util");
const transaction_1 = require("../transaction");
const action_1 = require("./action");
/**
 *
 */
class MintTokenAction extends action_1.Action {
    constructor(params) {
        // Convert params to Buffers
        const _params = {
            coin: new util_1.BN(params.coin),
            value: new util_1.BN(params.value),
        };
        super(_params);
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
exports.MintTokenAction = MintTokenAction;
MintTokenAction.txType = transaction_1.TransactionType.MINT_TOKEN;
