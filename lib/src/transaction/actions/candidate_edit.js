"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditCandidateAction = void 0;
const util_1 = require("../../util");
const internal_1 = require("../internal");
const action_1 = require("./action");
/**
 *
 */
class EditCandidateAction extends action_1.Action {
    constructor(data) {
        let _data = data;
        if (typeof data == 'object' && !Buffer.isBuffer(data)) {
            _data = {
                publicKey: util_1.toBuffer(data.publicKey),
                ownerAddress: util_1.toBuffer(data.ownerAddress),
                controlAddress: util_1.toBuffer(data.controlAddress),
                rewardAddress: util_1.toBuffer(data.rewardAddress),
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
EditCandidateAction.txType = internal_1.TransactionType.EDIT_CANDIDATE;
