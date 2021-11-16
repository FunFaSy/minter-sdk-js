"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getErrorTypeFromErrorCode = exports.getErrorTypeFromErrorMessage = exports.formatError = exports.parseTransactionResultError = exports.parseRpcError = exports.ServerErrorCode = exports.ServerTransactionError = exports.ServerError = void 0;
const mustache_1 = __importDefault(require("mustache"));
const messages = __importStar(require("./error_messages.json"));
const errors_1 = require("../../util/errors");
const util_1 = require("../../util");
/**
 * MINTER  have no standardised ERRORS even codes tells nothing.
 *
 */
const mustacheHelpers = {
    formatBip: () => (n, render) => util_1.formatBipAmount(render(n)),
};
class ServerError extends errors_1.TypedError {
}
exports.ServerError = ServerError;
class ServerTransactionError extends ServerError {
}
exports.ServerTransactionError = ServerTransactionError;
/** !!! Codes tells nothing! Different errors can have same code*/
// https://github.com/MinterTeam/minter-go-node/blob/master/coreV2/code/code.go#L8
var ServerErrorCode;
(function (ServerErrorCode) {
    ServerErrorCode[ServerErrorCode["OK"] = 0] = "OK";
    ServerErrorCode[ServerErrorCode["WrongNonce"] = 101] = "WrongNonce";
    ServerErrorCode[ServerErrorCode["CoinNotExists"] = 102] = "CoinNotExists";
    ServerErrorCode[ServerErrorCode["CoinReserveNotSufficient"] = 103] = "CoinReserveNotSufficient";
    ServerErrorCode[ServerErrorCode["TxTooLarge"] = 105] = "TxTooLarge";
    ServerErrorCode[ServerErrorCode["DecodeError"] = 106] = "DecodeError";
    ServerErrorCode[ServerErrorCode["InsufficientFunds"] = 107] = "InsufficientFunds";
    ServerErrorCode[ServerErrorCode["TxPayloadTooLarge"] = 109] = "TxPayloadTooLarge";
    ServerErrorCode[ServerErrorCode["TxServiceDataTooLarge"] = 110] = "TxServiceDataTooLarge";
    ServerErrorCode[ServerErrorCode["InvalidMultisendData"] = 111] = "InvalidMultisendData";
    ServerErrorCode[ServerErrorCode["CoinSupplyOverflow"] = 112] = "CoinSupplyOverflow";
    ServerErrorCode[ServerErrorCode["TxFromSenderAlreadyInMempool"] = 113] = "TxFromSenderAlreadyInMempool";
    ServerErrorCode[ServerErrorCode["TooLowGasPrice"] = 114] = "TooLowGasPrice";
    ServerErrorCode[ServerErrorCode["WrongChainID"] = 115] = "WrongChainID";
    ServerErrorCode[ServerErrorCode["CoinReserveUnderflow"] = 116] = "CoinReserveUnderflow";
    ServerErrorCode[ServerErrorCode["WrongHaltHeight"] = 117] = "WrongHaltHeight";
    ServerErrorCode[ServerErrorCode["HaltAlreadyExists"] = 118] = "HaltAlreadyExists";
    ServerErrorCode[ServerErrorCode["CommissionCoinNotSufficient"] = 119] = "CommissionCoinNotSufficient";
    ServerErrorCode[ServerErrorCode["VoteExpired"] = 120] = "VoteExpired";
    ServerErrorCode[ServerErrorCode["VoteAlreadyExists"] = 121] = "VoteAlreadyExists";
    ServerErrorCode[ServerErrorCode["WrongUpdateVersionName"] = 122] = "WrongUpdateVersionName";
    // coin creation,
    ServerErrorCode[ServerErrorCode["CoinHasNotReserve"] = 200] = "CoinHasNotReserve";
    ServerErrorCode[ServerErrorCode["CoinAlreadyExists"] = 201] = "CoinAlreadyExists";
    ServerErrorCode[ServerErrorCode["WrongCrr"] = 202] = "WrongCrr";
    ServerErrorCode[ServerErrorCode["InvalidCoinSymbol"] = 203] = "InvalidCoinSymbol";
    ServerErrorCode[ServerErrorCode["InvalidCoinName"] = 204] = "InvalidCoinName";
    ServerErrorCode[ServerErrorCode["WrongCoinSupply"] = 205] = "WrongCoinSupply";
    ServerErrorCode[ServerErrorCode["WrongCoinEmission"] = 206] = "WrongCoinEmission";
    //' recreate coin,
    ServerErrorCode[ServerErrorCode["IsNotOwnerOfCoin"] = 206] = "IsNotOwnerOfCoin";
    //' convert,
    ServerErrorCode[ServerErrorCode["CrossConvert"] = 301] = "CrossConvert";
    ServerErrorCode[ServerErrorCode["MaximumValueToSellReached"] = 302] = "MaximumValueToSellReached";
    ServerErrorCode[ServerErrorCode["MinimumValueToBuyReached"] = 303] = "MinimumValueToBuyReached";
    ServerErrorCode[ServerErrorCode["TxNotFound"] = 400] = "TxNotFound";
    //' candidate
    ServerErrorCode[ServerErrorCode["CandidateExists"] = 401] = "CandidateExists";
    ServerErrorCode[ServerErrorCode["WrongCommission"] = 402] = "WrongCommission";
    ServerErrorCode[ServerErrorCode["CandidateNotFound"] = 403] = "CandidateNotFound";
    ServerErrorCode[ServerErrorCode["StakeNotFound"] = 404] = "StakeNotFound";
    ServerErrorCode[ServerErrorCode["InsufficientStake"] = 405] = "InsufficientStake";
    ServerErrorCode[ServerErrorCode["IsNotOwnerOfCandidate"] = 406] = "IsNotOwnerOfCandidate";
    ServerErrorCode[ServerErrorCode["IncorrectPubKey"] = 407] = "IncorrectPubKey";
    ServerErrorCode[ServerErrorCode["StakeShouldBePositive"] = 408] = "StakeShouldBePositive";
    ServerErrorCode[ServerErrorCode["TooLowStake"] = 409] = "TooLowStake";
    ServerErrorCode[ServerErrorCode["PublicKeyInBlockList"] = 410] = "PublicKeyInBlockList";
    ServerErrorCode[ServerErrorCode["NewPublicKeyIsBad"] = 411] = "NewPublicKeyIsBad";
    ServerErrorCode[ServerErrorCode["InsufficientWaitList"] = 412] = "InsufficientWaitList";
    ServerErrorCode[ServerErrorCode["PeriodLimitReached"] = 413] = "PeriodLimitReached";
    ServerErrorCode[ServerErrorCode["CandidateJailed"] = 414] = "CandidateJailed";
    //' check,
    ServerErrorCode[ServerErrorCode["CheckInvalidLock"] = 501] = "CheckInvalidLock";
    ServerErrorCode[ServerErrorCode["CheckExpired"] = 502] = "CheckExpired";
    ServerErrorCode[ServerErrorCode["CheckUsed"] = 503] = "CheckUsed";
    ServerErrorCode[ServerErrorCode["TooHighGasPrice"] = 504] = "TooHighGasPrice";
    ServerErrorCode[ServerErrorCode["WrongGasCoin"] = 505] = "WrongGasCoin";
    ServerErrorCode[ServerErrorCode["TooLongNonce"] = 506] = "TooLongNonce";
    //' multisig,
    ServerErrorCode[ServerErrorCode["IncorrectWeights"] = 601] = "IncorrectWeights";
    ServerErrorCode[ServerErrorCode["MultisigExists"] = 602] = "MultisigExists";
    ServerErrorCode[ServerErrorCode["MultisigNotExists"] = 603] = "MultisigNotExists";
    ServerErrorCode[ServerErrorCode["IncorrectMultiSignature"] = 604] = "IncorrectMultiSignature";
    ServerErrorCode[ServerErrorCode["TooLargeOwnersList"] = 605] = "TooLargeOwnersList";
    ServerErrorCode[ServerErrorCode["DuplicatedAddresses"] = 606] = "DuplicatedAddresses";
    ServerErrorCode[ServerErrorCode["DifferentCountAddressesAndWeights"] = 607] = "DifferentCountAddressesAndWeights";
    ServerErrorCode[ServerErrorCode["IncorrectTotalWeights"] = 608] = "IncorrectTotalWeights";
    ServerErrorCode[ServerErrorCode["NotEnoughMultisigVotes"] = 609] = "NotEnoughMultisigVotes";
    // swap pool
    ServerErrorCode[ServerErrorCode["SwapPoolUnknown"] = 700] = "SwapPoolUnknown";
    ServerErrorCode[ServerErrorCode["PairNotExists"] = 701] = "PairNotExists";
    ServerErrorCode[ServerErrorCode["InsufficientInputAmount"] = 702] = "InsufficientInputAmount";
    ServerErrorCode[ServerErrorCode["InsufficientLiquidity"] = 703] = "InsufficientLiquidity";
    ServerErrorCode[ServerErrorCode["InsufficientLiquidityMinted"] = 704] = "InsufficientLiquidityMinted";
    ServerErrorCode[ServerErrorCode["InsufficientLiquidityBurned"] = 705] = "InsufficientLiquidityBurned";
    ServerErrorCode[ServerErrorCode["InsufficientLiquidityBalance"] = 706] = "InsufficientLiquidityBalance";
    ServerErrorCode[ServerErrorCode["InsufficientOutputAmount"] = 707] = "InsufficientOutputAmount";
    ServerErrorCode[ServerErrorCode["PairAlreadyExists"] = 708] = "PairAlreadyExists";
    ServerErrorCode[ServerErrorCode["TooLongSwapRoute"] = 709] = "TooLongSwapRoute";
    // emission coin
    ServerErrorCode[ServerErrorCode["CoinIsNotToken"] = 800] = "CoinIsNotToken";
    ServerErrorCode[ServerErrorCode["CoinNotMintable"] = 801] = "CoinNotMintable";
    ServerErrorCode[ServerErrorCode["CoinNotBurnable"] = 802] = "CoinNotBurnable";
})(ServerErrorCode = exports.ServerErrorCode || (exports.ServerErrorCode = {}));
function parseRpcError(errorObj) {
    const result = {};
    let errorClassName = 'UnknownServerError';
    // if (errorObj?.code) {
    //     errorClassName = getErrorTypeFromErrorCode(errorObj?.code);
    // }
    // //
    // else if (errorObj?.data) {
    //     errorClassName = walkSubtype(errorObj.data, schema.schema, result, '');
    // }
    // //
    // else {
    const errorMessage = `[${errorObj.code}] ${errorObj.message}: ${JSON.stringify(errorObj.data)}`;
    // NOTE: All this hackery is happening because structured errors not implemented
    errorClassName = getErrorTypeFromErrorMessage(errorMessage);
    result['msg_text'] = errorMessage;
    // }
    // NOTE: This assumes that all errors extend TypedError
    const msg = formatError(errorClassName, result);
    const error = new ServerError(msg, errorClassName, errorObj);
    Object.assign(error, result);
    return error;
}
exports.parseRpcError = parseRpcError;
function parseTransactionResultError(result) {
    const server_error = parseRpcError(result.error);
    const server_tx_error = new ServerTransactionError();
    Object.assign(server_tx_error, server_error);
    server_tx_error.type = server_error.type;
    server_tx_error.message = server_error.message;
    server_tx_error.transaction = result.hash;
    return server_tx_error;
}
exports.parseTransactionResultError = parseTransactionResultError;
function formatError(errorClassName, errorData) {
    if (typeof messages[errorClassName] === 'string') {
        return mustache_1.default.render(messages[errorClassName], {
            ...errorData,
            ...mustacheHelpers,
        });
    }
    return JSON.stringify(errorData);
}
exports.formatError = formatError;
/**
 * Walks through defined schema returning error(s) recursively
 * @param errorObj The error to be parsed
 * @param schema A defined schema in JSON mapping to the RPC errors
 * @param result An object used in recursion or called directly
 * @param typeName The human-readable error type name as defined in the JSON mapping
 */
const walkSubtype = function (errorObj, schema, result, typeName) {
    let error;
    let type;
    let errorTypeName;
    for (const errorName in schema) {
        if (util_1.isString(errorObj[errorName])) {
            // Return early if error type is in a schema
            return errorObj[errorName];
        }
        if (util_1.isObject(errorObj[errorName])) {
            error = errorObj[errorName];
            type = schema[errorName];
            errorTypeName = errorName;
        }
        else if (util_1.isObject(errorObj.kind) && util_1.isObject(errorObj.kind[errorName])) {
            error = errorObj.kind[errorName];
            type = schema[errorName];
            errorTypeName = errorName;
        }
    }
    if (error && type) {
        for (const prop of Object.keys(type.props)) {
            result[prop] = error[prop];
        }
        return walkSubtype(error, schema, result, errorTypeName);
    }
    else {
        // TODO: is this the right thing to do?
        result.kind = errorObj;
        return typeName;
    }
};
function getErrorTypeFromErrorMessage(errorMessage) {
    // This function should be removed when JSON RPC starts returning typed errors.
    switch (true) {
        //
        case /^(.*?)tx(.*?)not found(.*?)$/.test(errorMessage):
            return 'TxNotFound';
        //
        case /^(.*?)tx(.*?)already exists in cache(.*?)$/.test(errorMessage):
            return 'TxAlreadyExists';
        default:
            return 'UnknownServerError';
    }
}
exports.getErrorTypeFromErrorMessage = getErrorTypeFromErrorMessage;
function getErrorTypeFromErrorCode(code) {
    // This function should be removed when JSON RPC starts returning typed errors.
    switch (true) {
        case ServerErrorCode[code]:
            return ServerErrorCode[code];
        default:
            return 'UnknownServerError';
    }
}
exports.getErrorTypeFromErrorCode = getErrorTypeFromErrorCode;
/**
 error:{
    code: "0",
    log: "",
    hash: "Mt1cea90c78f69a9a62e6fe1d349470e4d598229aabf71dd9b76ae174c9fb73abe"
}

 error: {
    code: "101",
    message: "Unexpected nonce. Expected: 12, got 11.",
    data: {
        expected_nonce: "12",
        got_nonce: "11"
    }
}

 error: {
    code: "106",
    message: "rlp: expected input list for transaction.MultisendDataItem, decoding into (transaction.MultisendData).List[0]",
    data: { }
}
 error: {
    code: "106",
    message: "rlp: input string too long for types.CoinSymbol, decoding into (transaction.CreateTokenData).Symbol",
    data: { }
}

 error: {
    code: "106",
    message: "rlp: input list has too many elements for transaction.AddLiquidityDataV240",
    data: { }
}
 error: {
    code: "106",
    message: "tx type 30783162 is not registered",
    data: { }
}
 error: {
    code: "106",
    message: "More or less parameters than expected",
    data: { }
}

 error: {
    code: "107",
    message: "Insufficient funds for sender account: Mx0bd4dd45fc7072ce6f1a4b297706174ee2f86910. Wanted 100000000000000000000 USDCE",
    data: {
        coin_id: "1844",
        coin_symbol: "USDCE",
        needed_value: "100000000000000000000",
        sender: "Mx0bd4dd45fc7072ce6f1a4b297706174ee2f86910"
    }
}

 error: {
    code: "115",
    message: "Wrong chain id",
    data: {
        current_chain_id: "2",
        got_chain_id: "3"
    }
}

 error: {
    code: "120",
    message: "Halt height should be equal or bigger than current: 6284865",
    data: {
    block: "200000",
    current_block: "Mpaaaaa16ebd6af229b4cfc02c3ab40bd25c1051c3aa2120f07d08c1bd01777778"
    }
}

 error: {
    code: "122",
    message: "wrong version name",
    data: { }
}

 error: {
    code: "202",
    message: "Constant Reserve Ratio should be between 10 and 100",
    data: {
        got_crr: "0",
        max_crr: "100",
        min_crr: "10"
    }
}

 error: {
    code: "205",
    message: "Coin supply should be between 1000000000000000000 and 1000000000000000000000000",
    data: {
        current_coin_supply: "1000000000000000000000000",
        current_initial_amount: "2000000000000000000000000",
        current_initial_reserve: "10000000000000000000000",
        max_coin_supply: "1000000000000000000000000000000000",
        min_coin_supply: "1000000000000000000",
        min_initial_reserve: "10000000000000000000000"
    }
}
 error: {
    code: "205",
    message: "Coin supply should be between 1000000000000000000 and 1",
        data: {
        current_coin_supply: "1",
        current_initial_amount: "1000000000000000000000000",
        current_initial_reserve: "10000000000000000000000000",
        max_coin_supply: "1000000000000000000000000000000000",
        min_coin_supply: "1000000000000000000",
        min_initial_reserve: "10000000000000000000000"
    }
}

 error: {
    code: "205",
    message: "Maximum supply cannot be more than the initial amount, if the token is not mintable",
    data: {
        current_coin_supply: "1000000000000000000000000",
        current_initial_amount: "100000000000000000000000",
        max_coin_supply: "1000000000000000000000000000000000",
        min_coin_supply: "1"
    }
}

 error: {
    code: "302",
    message: "You wanted to buy minimum 1000000000000000000 MNT, but currently you buy only 921393549816831207 MNT",
    data: {
        coin_id: "8",
        coin_symbol: "SHSCOIN",
        maximum_value_to_sell: "1000000000000000000",
        needed_spend_value: "921393549816831207"
    }
}

 error: {
    code: "400",
    message: "encoding/hex: invalid byte: U+0027 '''",
    data: { }
}

 error: {
    code: "401",
    message: "Candidate with such public key (Mpaaaaa16ebd6af229b4cfc02c3ab40bd25c1051c3aa2120f07d08c1bd01777777) already exists",
    data: {
        public_key: "Mpaaaaa16ebd6af229b4cfc02c3ab40bd25c1051c3aa2120f07d08c1bd01777777"
    }
}

 error: {
    code: "409",
    message: "tx already exists in cache",
    data: { }
}
 error: {
    code: "411",
    message: "Current public key (Mp6787a7adfed250d13cd089db516e274d71f105f4e6a0639e0f9521985ea6c201) equals new public key (Mp6787a7adfed250d13cd089db516e274d71f105f4e6a0639e0f9521985ea6c201)",
    data: {
        new_public_key: "Mp6787a7adfed250d13cd089db516e274d71f105f4e6a0639e0f9521985ea6c201",
        public_key: "Mp6787a7adfed250d13cd089db516e274d71f105f4e6a0639e0f9521985ea6c201"
    }
}

 error: {
    code: "609",
    message: "Not enough multisig votes. Needed 70, has 60",
    data: {
        got_votes: "60",
        needed_votes: "70"
    }
}

 error: {
    code: "701",
    message: "swap pool not found",
    data: {
    coin0: "2010",
    coin1: "0"
    }
}

 error: {
    code: "708",
    message: "swap pool already exist",
    data: {
        coin0: "1844",
        coin1: "0"
    }
}

 error: {
    code: "713",
    message: "order price is 1.0000000000000000000000000000000000, but must not exceed 0.7588197427709223431894510718659565 and more than 0.1517639485541844686378902143731913",
    data: {
        max_price: "0.1517639485541844686378902143731913",
        min_price: "0.7588197427709223431894510718659565",
        order_price: "1.0000000000000000000000000000000000"
    }
}

 error: {
    code: "802",
        message: "Coin not burnable",
        data: {
        coin_id: "2010",
        coin_symbol: "SUPERTOKEN"
    }
}

 */
