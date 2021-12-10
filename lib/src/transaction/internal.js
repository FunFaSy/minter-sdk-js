"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionType = void 0;
/**
 * circular dependency issue Fix.
 * !!! Important values case-sensitive
 * @see (https://medium.com/visual-development/how-to-fix-nasty-circular-dependency-issues-once-and-for-all-in-javascript-typescript-a04c987cf0de)
 */
var TransactionType;
(function (TransactionType) {
    TransactionType["SEND"] = "0x01";
    TransactionType["SELL"] = "0x02";
    TransactionType["SELL_ALL"] = "0x03";
    TransactionType["BUY"] = "0x04";
    TransactionType["CREATE_COIN"] = "0x05";
    TransactionType["DECLARE_CANDIDACY"] = "0x06";
    TransactionType["DELEGATE"] = "0x07";
    TransactionType["UNBOND"] = "0x08";
    TransactionType["REDEEM_CHECK"] = "0x09";
    TransactionType["SET_CANDIDATE_ON"] = "0x0A";
    TransactionType["SET_CANDIDATE_OFF"] = "0x0B";
    TransactionType["CREATE_MULTISIG"] = "0x0C";
    TransactionType["MULTISEND"] = "0x0D";
    TransactionType["EDIT_CANDIDATE"] = "0x0E";
    TransactionType["SET_HALT_BLOCK"] = "0x0F";
    TransactionType["RECREATE_COIN"] = "0x10";
    TransactionType["EDIT_TICKER_OWNER"] = "0x11";
    TransactionType["EDIT_MULTISIG"] = "0x12";
    TransactionType["PRICE_VOTE"] = "0x13";
    TransactionType["EDIT_CANDIDATE_PUBLIC_KEY"] = "0x14";
    TransactionType["ADD_LIQUIDITY"] = "0x15";
    TransactionType["REMOVE_LIQUIDITY"] = "0x16";
    TransactionType["SELL_SWAP_POOL"] = "0x17";
    TransactionType["BUY_SWAP_POOL"] = "0x18";
    TransactionType["SELL_ALL_SWAP_POOL"] = "0x19";
    TransactionType["EDIT_CANDIDATE_COMMISSION"] = "0x1A";
    TransactionType["MOVE_STAKE"] = "0x1B";
    TransactionType["MINT_TOKEN"] = "0x1C";
    TransactionType["BURN_TOKEN"] = "0x1D";
    TransactionType["CREATE_TOKEN"] = "0x1E";
    TransactionType["RECREATE_TOKEN"] = "0x1F";
    TransactionType["VOTE_COMMISSION"] = "0x20";
    TransactionType["VOTE_UPDATE"] = "0x21";
    TransactionType["CREATE_SWAP_POOL"] = "0x22";
    TransactionType["ADD_LIMIT_ORDER"] = "0x23";
    TransactionType["REMOVE_LIMIT_ORDER"] = "0x24";
})(TransactionType = exports.TransactionType || (exports.TransactionType = {}));
