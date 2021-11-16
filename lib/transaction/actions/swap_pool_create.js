"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSwapPoolAction = void 0;
const util_1 = require("../../util");
const internal_1 = require("../internal");
const action_1 = require("./action");
/**
 *
 */
class CreateSwapPoolAction extends action_1.Action {
    constructor(data) {
        let _data = data;
        if (typeof data == 'object' && !Buffer.isBuffer(data)) {
            _data = {
                coin0: new util_1.BN(data?.coin0),
                coin1: new util_1.BN(data?.coin1),
                volume0: new util_1.BN(data?.volume0),
                volume1: new util_1.BN(data?.volume1),
            };
        }
        super(_data);
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
CreateSwapPoolAction.txType = internal_1.TransactionType.CREATE_SWAP_POOL;
