"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoveStakeAction = void 0;
const util_1 = require("../../util");
const internal_1 = require("../internal");
const action_1 = require("./action");
const external_1 = require("../../util/external");
/**
 *
 */
class MoveStakeAction extends action_1.Action {
    constructor(data) {
        let _data = data;
        if (typeof data == 'object' && !Buffer.isBuffer(data)) {
            _data = {
                from: util_1.toBuffer(data?.from),
                to: util_1.toBuffer(data?.to),
                coin: new external_1.BN(data?.coin),
                stake: new external_1.BN(data?.stake),
            };
        }
        throw new Error('Action MoveStake disabled for now. @link https://www.minter.network/docs#move-stake-transaction');
        // TODO: Validation
        super(_data);
    }
    rlpSchema() {
        return [
            {
                name: 'from',
                length: 32,
            },
            {
                name: 'to',
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
exports.MoveStakeAction = MoveStakeAction;
MoveStakeAction.txType = internal_1.TransactionType.MOVE_STAKE;
