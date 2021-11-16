"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditCandidatePubKeyAction = void 0;
const util_1 = require("../../util");
const internal_1 = require("../internal");
const action_1 = require("./action");
/**
 *
 */
class EditCandidatePubKeyAction extends action_1.Action {
    constructor(data) {
        let _data = data;
        if (typeof data == 'object' && !Buffer.isBuffer(data)) {
            _data = {
                publicKey: util_1.toBuffer(data.publicKey),
                newPublicKey: util_1.toBuffer(data.newPublicKey),
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
                name: 'newPublicKey',
                length: 32,
            },
        ];
    }
}
exports.EditCandidatePubKeyAction = EditCandidatePubKeyAction;
EditCandidatePubKeyAction.txType = internal_1.TransactionType.EDIT_CANDIDATE_PUBLIC_KEY;
