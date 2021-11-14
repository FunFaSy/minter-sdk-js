"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeclareCandidacyAction = void 0;
const util_1 = require("../../util");
const transaction_1 = require("../transaction");
const base_action_1 = require("./base_action");
/**
 *
 */
class DeclareCandidacyAction extends base_action_1.Action {
    constructor(params) {
        // Convert params to Buffers
        const _params = {
            address: util_1.toBuffer(params.address),
            publicKey: util_1.toBuffer(params.publicKey),
            commission: new util_1.BN(params.commission),
            coin: new util_1.BN(params.coin),
            stake: new util_1.BN(params.stake),
        };
        // TODO: Validation
        super(_params);
        this.txType = transaction_1.TransactionType.DECLARE_CANDIDACY;
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
