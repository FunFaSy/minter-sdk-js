"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoteHaltBlockAction = void 0;
const util_1 = require("../../util");
const transaction_1 = require("../transaction");
const action_1 = require("./action");
const external_1 = require("../../util/external");
/**
 *
 */
class VoteHaltBlockAction extends action_1.Action {
    constructor(params) {
        // Convert params to Buffers
        const _params = {
            publicKey: util_1.toBuffer(params.publicKey),
            height: new external_1.BN(params.height),
        };
        // TODO: Validation
        super(_params);
        this.txType = transaction_1.TransactionType.SET_HALT_BLOCK;
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
