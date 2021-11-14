"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoteNetUpdateAction = void 0;
const util_1 = require("../../util");
const transaction_1 = require("../transaction");
const base_action_1 = require("./base_action");
const external_1 = require("../../util/external");
/**
 *
 */
class VoteNetUpdateAction extends base_action_1.Action {
    constructor(params) {
        // Convert params to Buffers
        const _params = {
            publicKey: util_1.toBuffer(params.publicKey),
            version: Buffer.from(params.version, 'utf8'),
            height: new external_1.BN(params.height),
        };
        // TODO: Validation
        // version regexp("^[a-zA-Z0-9_]{1,20}$")
        super(_params);
        this.txType = transaction_1.TransactionType.VOTE_UPDATE;
    }
    rlpSchema() {
        return [
            {
                name: 'version',
            },
            {
                name: 'publicKey',
                length: 32,
            },
            {
                name: 'height',
                length: 32,
                allowLess: true,
            }
        ];
    }
}
exports.VoteNetUpdateAction = VoteNetUpdateAction;
