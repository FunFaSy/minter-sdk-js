"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoveStakeAction = void 0;
const util_1 = require("../../util");
const transaction_1 = require("../transaction");
const action_1 = require("./action");
const external_1 = require("../../util/external");
/**
 *
 */
class MoveStakeAction extends action_1.Action {
    constructor(params) {
        // Convert params to Buffers
        const _params = {
            from: util_1.toBuffer(params.from),
            to: util_1.toBuffer(params.to),
            coin: new external_1.BN(params.coin),
            stake: new external_1.BN(params.stake),
        };
        throw new Error('Action MoveStake disabled for now. @link https://www.minter.network/docs#move-stake-transaction');
        // TODO: Validation
        super(_params);
        this.txType = transaction_1.TransactionType.MOVE_STAKE;
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
