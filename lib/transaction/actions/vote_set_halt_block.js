"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoteHaltBlockAction = void 0;
const util_1 = require("../../util");
const internal_1 = require("../internal");
const action_1 = require("./action");
const external_1 = require("../../util/external");
/**
 *
 */
class VoteHaltBlockAction extends action_1.Action {
    constructor(data) {
        let _data = data;
        if (typeof data == 'object' && !Buffer.isBuffer(data)) {
            _data = {
                publicKey: util_1.toBuffer(data.publicKey),
                height: new external_1.BN(data.height),
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
                name: 'height',
                length: 32,
                allowLess: true,
            }
        ];
    }
}
exports.VoteHaltBlockAction = VoteHaltBlockAction;
VoteHaltBlockAction.txType = internal_1.TransactionType.SET_HALT_BLOCK;
