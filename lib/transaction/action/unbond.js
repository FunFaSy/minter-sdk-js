"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnbondAction = void 0;
const util_1 = require("../../util");
const transaction_1 = require("../transaction");
const base_action_1 = require("./base_action");
const external_1 = require("../../util/external");
/**
 *
 */
class UnbondAction extends base_action_1.Action {
    constructor(params) {
        // Convert params to Buffers
        const _params = {
            publicKey: util_1.toBuffer(params.publicKey),
            coin: new external_1.BN(params.coin),
            stake: new external_1.BN(params.stake)
        };
        // TODO: Validation
        super(_params);
        this.txType = transaction_1.TransactionType.UNBOND;
    }
    rlpSchema() {
        return [
            {
                name: 'publicKey',
                length: 32,
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
            }
        ];
    }
}
exports.UnbondAction = UnbondAction;
