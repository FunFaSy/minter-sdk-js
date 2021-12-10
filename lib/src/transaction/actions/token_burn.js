"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BurnTokenAction = void 0;
const util_1 = require("../../util");
const internal_1 = require("../internal");
const action_1 = require("./action");
/**
 *
 */
class BurnTokenAction extends action_1.Action {
    constructor(data) {
        let _data = data;
        if (typeof data == 'object' && !Buffer.isBuffer(data)) {
            _data = {
                coin: new util_1.BN(data.coin),
                value: new util_1.BN(data.value),
            };
        }
        super(_data);
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
BurnTokenAction.txType = internal_1.TransactionType.BURN_TOKEN;
