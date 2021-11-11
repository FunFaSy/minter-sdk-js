"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveLiquidityAction = void 0;
const util_1 = require("../../util");
const transaction_1 = require("../transaction");
const base_action_1 = require("./base_action");
/**
 *
 */
class RemoveLiquidityAction extends base_action_1.Action {
    constructor(params) {
        // Convert params to Buffers
        const _params = {
            coin0: new util_1.BN(params.coin0),
            coin1: new util_1.BN(params.coin1),
            liquidity: new util_1.BN(params.liquidity),
            minimumVolume0: new util_1.BN(params.minimumVolume0),
            minimumVolume1: new util_1.BN(params.minimumVolume1),
        };
        super(_params);
        this.txType = transaction_1.TransactionType.REMOVE_LIQUIDITY;
    }
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
                name: 'liquidity',
                length: 32,
                allowLess: true,
            },
            {
                name: 'minimumVolume0',
                length: 32,
                allowLess: true,
            },
            {
                name: 'minimumVolume1',
                length: 32,
                allowLess: true,
            },
        ];
    }
}
exports.RemoveLiquidityAction = RemoveLiquidityAction;
