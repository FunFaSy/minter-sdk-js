"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetCandidateOffAction = void 0;
const util_1 = require("../../util");
const transaction_1 = require("../transaction");
const action_1 = require("./action");
/**
 *
 */
class SetCandidateOffAction extends action_1.Action {
    constructor(params) {
        // Convert params to Buffers
        const _params = {
            publicKey: util_1.toBuffer(params.publicKey),
        };
        // TODO: Validation
        super(_params);
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
SetCandidateOffAction.txType = transaction_1.TransactionType.SET_CANDIDATE_OFF;
