"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedeemCheckAction = void 0;
const transaction_1 = require("../transaction");
const action_1 = require("./action");
const check_1 = require("../../check/check");
const util_1 = require("../../util");
/**
 *
 */
class RedeemCheckAction extends action_1.Action {
    constructor(params) {
        // Convert params to Buffers
        const _params = {
            check: (typeof params.check == 'string') ? (new check_1.Check(params.check)).serialize() : params.check.serialize(),
            proof: (typeof params.proof == 'string') ? util_1.toBuffer(params.proof) : params.proof,
        };
        super(_params);
    }
    rlpSchema() {
        return [
            {
                name: 'check',
                allowZero: false,
                default: Buffer.from([]),
            },
            {
                name: 'proof',
                // allow DataRedeemCheck without proof (it will be filled later from password)
                allowZero: true,
                length: 65,
                default: Buffer.from([]),
            },
        ];
    }
}
exports.RedeemCheckAction = RedeemCheckAction;
RedeemCheckAction.txType = transaction_1.TransactionType.REDEEM_CHECK;
