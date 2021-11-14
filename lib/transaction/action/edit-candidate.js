"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditCandidateAction = void 0;
const util_1 = require("../../util");
const transaction_1 = require("../transaction");
const base_action_1 = require("./base_action");
/**
 *
 */
class EditCandidateAction extends base_action_1.Action {
    constructor(params) {
        // Convert params to Buffers
        const _params = {
            publicKey: util_1.toBuffer(params.publicKey),
            ownerAddress: util_1.toBuffer(params.ownerAddress),
            controlAddress: util_1.toBuffer(params.controlAddress),
            rewardAddress: util_1.toBuffer(params.rewardAddress),
        };
        // TODO: Validation
        super(_params);
        this.txType = transaction_1.TransactionType.EDIT_CANDIDATE;
    }
    rlpSchema() {
        return [
            {
                name: 'publicKey',
                length: 32,
            },
            {
                name: 'rewardAddress',
                length: 20,
            },
            {
                name: 'ownerAddress',
                length: 20,
            },
            {
                name: 'controlAddress',
                length: 20,
            }
        ];
    }
}
exports.EditCandidateAction = EditCandidateAction;
