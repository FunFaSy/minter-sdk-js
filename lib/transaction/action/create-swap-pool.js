"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSwapPoolAction = void 0;
const util_1 = require("../../util");
const transaction_1 = require("../transaction");
const base_action_1 = require("./base_action");
/**
 *
 */
class CreateSwapPoolAction extends base_action_1.Action {
    /**
     *
     * @param params
     */
    constructor(params) {
        // Convert params to Buffers
        const _params = {
            coin0: new util_1.BN(params.coin0),
            coin1: new util_1.BN(params.coin1),
            volume0: new util_1.BN(params.volume0),
            volume1: new util_1.BN(params.volume1),
        };
        super(_params);
        this.txType = transaction_1.TransactionType.CREATE_SWAP_POOL;
    }
    /**
     *
     */
    rlpSchema() {
        return [
            {
                name: 'coin0',
                length: 4,
                allowLess: true,
            },
            {
                name: 'coin1',
                length: 4,
                allowLess: true,
            },
            {
                name: 'volume0',
                length: 32,
                allowLess: true,
            },
            {
                name: 'volume1',
                length: 32,
                allowLess: true,
            },
        ];
    }
}
exports.CreateSwapPoolAction = CreateSwapPoolAction;
