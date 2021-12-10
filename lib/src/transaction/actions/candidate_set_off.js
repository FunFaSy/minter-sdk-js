"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetCandidateOffAction = void 0;
const util_1 = require("../../util");
const internal_1 = require("../internal");
const action_1 = require("./action");
/**
 *
 */
class SetCandidateOffAction extends action_1.Action {
    constructor(data) {
        let _data = data;
        if (typeof data == 'object' && !Buffer.isBuffer(data)) {
            _data = {
                publicKey: util_1.toBuffer(data.publicKey),
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
            }
        ];
    }
}
exports.SetCandidateOffAction = SetCandidateOffAction;
SetCandidateOffAction.txType = internal_1.TransactionType.SET_CANDIDATE_OFF;
