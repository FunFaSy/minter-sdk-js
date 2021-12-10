"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveLiquidityAction = void 0;
const util_1 = require("../../util");
const internal_1 = require("../internal");
const action_1 = require("./action");
/**
 *
 */
class RemoveLiquidityAction extends action_1.Action {
    constructor(data) {
        let _data = data;
        if (typeof data == 'object' && !Buffer.isBuffer(data)) {
            _data = {
                coin0: new util_1.BN(data?.coin0),
                coin1: new util_1.BN(data?.coin1),
                liquidity: new util_1.BN(data?.liquidity),
                minimumVolume0: new util_1.BN(data?.minimumVolume0),
                minimumVolume1: new util_1.BN(data?.minimumVolume1),
            };
        }
        super(_data);
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
RemoveLiquidityAction.txType = internal_1.TransactionType.REMOVE_LIQUIDITY;
