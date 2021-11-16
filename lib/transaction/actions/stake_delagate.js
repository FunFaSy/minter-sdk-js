"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DelegateAction = void 0;
const util_1 = require("../../util");
const internal_1 = require("../internal");
const action_1 = require("./action");
const external_1 = require("../../util/external");
/**
 *
 */
class DelegateAction extends action_1.Action {
    constructor(data) {
        let _data = data;
        if (typeof data == 'object' && !Buffer.isBuffer(data)) {
            _data = {
                publicKey: util_1.toBuffer(data.publicKey),
                coin: new external_1.BN(data.coin),
                stake: new external_1.BN(data.stake),
            };
        }
        // TODO: Validation
        super(_data);
    }
    rlpSchema() {
        return [
            {
                name: 'publicKey',
                length: 32,
            },
            {
                name: 'coin',
                length: 4,
                allowLess: true,
            },
            {
                name: 'stake',
                length: 32,
                allowLess: true,
            }
        ];
    }
}
exports.DelegateAction = DelegateAction;
DelegateAction.txType = internal_1.TransactionType.DELEGATE;
