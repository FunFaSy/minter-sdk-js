"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeclareCandidacyAction = void 0;
const util_1 = require("../../util");
const internal_1 = require("../internal");
const action_1 = require("./action");
/**
 *
 */
class DeclareCandidacyAction extends action_1.Action {
    constructor(data) {
        let _data = data;
        if (typeof data == 'object' && !Buffer.isBuffer(data)) {
            _data = {
                address: util_1.toBuffer(data.address),
                publicKey: util_1.toBuffer(data.publicKey),
                commission: new util_1.BN(data.commission),
                coin: new util_1.BN(data.coin),
                stake: new util_1.BN(data.stake),
            };
        }
        // TODO: Validation
        super(_data);
    }
    rlpSchema() {
        return [
            {
                name: 'address',
                length: 20,
            },
            {
                name: 'publicKey',
                length: 32,
            },
            {
                name: 'commission',
                length: 1,
                allowLess: true,
            },
            {
                name: 'coin',
                length: 4,
                allowLess: true,
            },
            {
                name: 'stake',
                length: 32,
                allowLess: true,
                default: Buffer.from([]),
            }
        ];
    }
}
exports.DeclareCandidacyAction = DeclareCandidacyAction;
DeclareCandidacyAction.txType = internal_1.TransactionType.DECLARE_CANDIDACY;
