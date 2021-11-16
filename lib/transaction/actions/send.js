"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendAction = void 0;
const util_1 = require("../../util");
const internal_1 = require("../internal");
const action_1 = require("./action");
/**
 *
 */
class SendAction extends action_1.Action {
    constructor(data) {
        let _data = data;
        if (typeof data == 'object' && !Buffer.isBuffer(data)) {
            _data = {
                coin: data.coin ? new util_1.BN(data.coin) : undefined,
                value: data.value ? new util_1.BN(data.value) : undefined,
                to: data.to ? util_1.toBuffer(data.to) : undefined,
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
                name: 'to',
                length: 20,
            },
            {
                name: 'value',
                length: 32,
                allowLess: true,
            }
        ];
    }
}
exports.SendAction = SendAction;
SendAction.txType = internal_1.TransactionType.SEND;
