"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditCandidateCommissionAction = void 0;
const util_1 = require("../../util");
const internal_1 = require("../internal");
const action_1 = require("./action");
const external_1 = require("../../util/external");
/**
 *
 */
class EditCandidateCommissionAction extends action_1.Action {
    constructor(data) {
        let _data = data;
        if (typeof data == 'object' && !Buffer.isBuffer(data)) {
            _data = {
                publicKey: util_1.toBuffer(data.publicKey),
                commission: new external_1.BN(data.commission),
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
                name: 'commission',
                length: 1,
                allowLess: true,
            },
        ];
    }
}
exports.EditCandidateCommissionAction = EditCandidateCommissionAction;
EditCandidateCommissionAction.txType = internal_1.TransactionType.EDIT_CANDIDATE_COMMISSION;
