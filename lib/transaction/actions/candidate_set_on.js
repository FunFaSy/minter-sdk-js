"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetCandidateOnAction = void 0;
const util_1 = require("../../util");
const internal_1 = require("../internal");
const action_1 = require("./action");
/**
 *
 */
class SetCandidateOnAction extends action_1.Action {
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
exports.SetCandidateOnAction = SetCandidateOnAction;
SetCandidateOnAction.txType = internal_1.TransactionType.SET_CANDIDATE_ON;
