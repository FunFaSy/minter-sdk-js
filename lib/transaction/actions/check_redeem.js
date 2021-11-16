"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedeemCheckAction = void 0;
const internal_1 = require("../internal");
const action_1 = require("./action");
const check_1 = require("../../check/check");
const util_1 = require("../../util");
/**
 *
 */
class RedeemCheckAction extends action_1.Action {
    constructor(data) {
        let _data = data;
        if (typeof data == 'object' && !Buffer.isBuffer(data)) {
            _data = {
                check: (typeof data.check == 'string') ? (new check_1.Check(data.check)).serialize() : data.check.serialize(),
                proof: (typeof data.proof == 'string') ? util_1.toBuffer(data.proof) : data.proof,
            };
        }
        super(_data);
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
RedeemCheckAction.txType = internal_1.TransactionType.REDEEM_CHECK;
