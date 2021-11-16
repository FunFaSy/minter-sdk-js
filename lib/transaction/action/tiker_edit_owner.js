"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditTickerOwnerAction = void 0;
const transaction_1 = require("../transaction");
const action_1 = require("./action");
const util_1 = require("../../util");
/**
 *
 */
class EditTickerOwnerAction extends action_1.Action {
    /**
     *
     * @param params
     */
    constructor(params) {
        // Convert params to Buffers
        const _params = {
            symbol: Buffer.from(params.symbol, 'utf8'),
            newOwner: util_1.toBuffer(params.newOwner),
        };
        // TODO: Validation
        // Ticker symbol (for example, BTC). Must be unique, alphabetic, uppercase, and 3 to 10 symbols long.
        super(_params);
    }
    /**
     *
     */
    rlpSchema() {
        return [
            {
                name: 'symbol',
                length: 10,
            }, {
                name: 'newOwner',
                length: 20,
            }
        ];
    }
}
exports.EditTickerOwnerAction = EditTickerOwnerAction;
EditTickerOwnerAction.txType = transaction_1.TransactionType.EDIT_TICKER_OWNER;
