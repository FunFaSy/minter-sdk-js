"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditCandidateCommissionAction = void 0;
const util_1 = require("../../util");
const transaction_1 = require("../transaction");
const action_1 = require("./action");
const external_1 = require("../../util/external");
/**
 *
 */
class EditCandidateCommissionAction extends action_1.Action {
    constructor(params) {
        // Convert params to Buffers
        const _params = {
            publicKey: util_1.toBuffer(params.publicKey),
            commission: new external_1.BN(params.commission),
        };
        // TODO: Validation
        super(_params);
    }
    rlpSchema() {
        return [
            {
                name: 'publicKey',
                length: 32,
            },
            {
                name: 'commission',
                length: 1,
                allowLess: true,
            },
        ];
    }
}
exports.EditCandidateCommissionAction = EditCandidateCommissionAction;
EditCandidateCommissionAction.txType = transaction_1.TransactionType.EDIT_CANDIDATE_COMMISSION;
