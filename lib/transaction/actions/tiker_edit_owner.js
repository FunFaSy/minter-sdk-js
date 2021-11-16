"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditTickerOwnerAction = void 0;
const internal_1 = require("../internal");
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
    constructor(data) {
        let _data = data;
        if (typeof data == 'object' && !Buffer.isBuffer(data)) {
            _data = {
                symbol: Buffer.from(data.symbol, 'utf8'),
                newOwner: util_1.toBuffer(data.newOwner),
            };
        }
        // TODO: Validation
        // Ticker symbol (for example, BTC). Must be unique, alphabetic, uppercase, and 3 to 10 symbols long.
        super(_data);
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
EditTickerOwnerAction.txType = internal_1.TransactionType.EDIT_TICKER_OWNER;
