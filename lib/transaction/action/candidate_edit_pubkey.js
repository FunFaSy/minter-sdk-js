"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditCandidatePubKeyAction = void 0;
const util_1 = require("../../util");
const transaction_1 = require("../transaction");
const action_1 = require("./action");
/**
 *
 */
class EditCandidatePubKeyAction extends action_1.Action {
    constructor(params) {
        // Convert params to Buffers
        const _params = {
            publicKey: util_1.toBuffer(params.publicKey),
            newPublicKey: util_1.toBuffer(params.newPublicKey),
        };
        // TODO: Validation
        super(_params);
        this.txType = transaction_1.TransactionType.EDIT_CANDIDATE_PUBLIC_KEY;
    }
    rlpSchema() {
        return [
            {
                name: 'publicKey',
                length: 32,
            },
            {
                name: 'newPublicKey',
                length: 32,
            },
        ];
    }
}
exports.EditCandidatePubKeyAction = EditCandidatePubKeyAction;
