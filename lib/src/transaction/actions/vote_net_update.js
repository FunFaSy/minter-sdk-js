"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoteNetUpdateAction = void 0;
const util_1 = require("../../util");
const internal_1 = require("../internal");
const action_1 = require("./action");
const external_1 = require("../../util/external");
/**
 *
 */
class VoteNetUpdateAction extends action_1.Action {
    constructor(data) {
        let _data = data;
        if (typeof data == 'object' && !Buffer.isBuffer(data)) {
            _data = {
                publicKey: util_1.toBuffer(data.publicKey),
                version: Buffer.from(data.version, 'utf8'),
                height: new external_1.BN(data.height),
            };
        }
        // TODO: Validation
        // version regexp("^[a-zA-Z0-9_]{1,20}$")
        super(_data);
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
VoteNetUpdateAction.txType = internal_1.TransactionType.VOTE_UPDATE;
