"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetCandidateOffAction = void 0;
const util_1 = require("../../util");
const transaction_1 = require("../transaction");
const base_action_1 = require("./base_action");
/**
 *
 */
class SetCandidateOffAction extends base_action_1.Action {
    constructor(params) {
        // Convert params to Buffers
        const _params = {
            publicKey: util_1.toBuffer(params.publicKey),
        };
        // TODO: Validation
        super(_params);
        this.txType = transaction_1.TransactionType.SET_CANDIDATE_OFF;
    }
    rlpSchema() {
        return [
            {
                name: 'publicKey',
                length: 32,
            }
        ];
    }
}
exports.SetCandidateOffAction = SetCandidateOffAction;
