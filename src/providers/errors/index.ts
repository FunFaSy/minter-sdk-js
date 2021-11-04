import {TypedError} from '../../primitives/errors';
import Mustache from 'mustache';
import schema from '../../res/rpc_error_schema.json';
import messages from '../../res/error_messages.json';
import * as utils from '../../utils';

// https://github.com/MinterTeam/minter-go-node/blob/master/coreV2/code/code.go#L8
export enum ErrorCode {
    'OK'                                = 0,
    'WrongNonce'                        = 101,
    'CoinNotExists'                     = 102,
    'CoinReserveNotSufficient'          = 103,
    'TxTooLarge'                        = 105,
    'DecodeError'                       = 106,
    'InsufficientFunds'                 = 107,
    'TxPayloadTooLarge'                 = 109,
    'TxServiceDataTooLarge'             = 110,
    'InvalidMultisendData'              = 111,
    'CoinSupplyOverflow'                = 112,
    'TxFromSenderAlreadyInMempool'      = 113,
    'TooLowGasPrice'                    = 114,
    'WrongChainID'                      = 115,
    'CoinReserveUnderflow'              = 116,
    'WrongHaltHeight'                   = 117,
    'HaltAlreadyExists'                 = 118,
    'CommissionCoinNotSufficient'       = 119,
    'VoteExpired'                       = 120,
    'VoteAlreadyExists'                 = 121,
    'WrongUpdateVersionName'            = 122,

    // coin creation,
    'CoinHasNotReserve'                 = 200,
    'CoinAlreadyExists'                 = 201,
    'WrongCrr'                          = 202,
    'InvalidCoinSymbol'                 = 203,
    'InvalidCoinName'                   = 204,
    'WrongCoinSupply'                   = 205,
    'WrongCoinEmission'                 = 206,

    //' recreate coin,
    'IsNotOwnerOfCoin'                  = 206,

    //' convert,
    'CrossConvert'                      = 301,
    'MaximumValueToSellReached'         = 302,
    'MinimumValueToBuyReached'          = 303,

    //' candidate
    'CandidateExists'                   = 401,
    'WrongCommission'                   = 402,
    'CandidateNotFound'                 = 403,
    'StakeNotFound'                     = 404,
    'InsufficientStake'                 = 405,
    'IsNotOwnerOfCandidate'             = 406,
    'IncorrectPubKey'                   = 407,
    'StakeShouldBePositive'             = 408,
    'TooLowStake'                       = 409,
    'PublicKeyInBlockList'              = 410,
    'NewPublicKeyIsBad'                 = 411,
    'InsufficientWaitList'              = 412,
    'PeriodLimitReached'                = 413,
    'CandidateJailed'                   = 414,

    //' check,
    'CheckInvalidLock'                  = 501,
    'CheckExpired'                      = 502,
    'CheckUsed'                         = 503,
    'TooHighGasPrice'                   = 504,
    'WrongGasCoin'                      = 505,
    'TooLongNonce'                      = 506,

    //' multisig,
    'IncorrectWeights'                  = 601,
    'MultisigExists'                    = 602,
    'MultisigNotExists'                 = 603,
    'IncorrectMultiSignature'           = 604,
    'TooLargeOwnersList'                = 605,
    'DuplicatedAddresses'               = 606,
    'DifferentCountAddressesAndWeights' = 607,
    'IncorrectTotalWeights'             = 608,
    'NotEnoughMultisigVotes'            = 609,

    // swap pool
    'SwapPoolUnknown'                   = 700,
    'PairNotExists'                     = 701,
    'InsufficientInputAmount'           = 702,
    'InsufficientLiquidity'             = 703,
    'InsufficientLiquidityMinted'       = 704,
    'InsufficientLiquidityBurned'       = 705,
    'InsufficientLiquidityBalance'      = 706,
    'InsufficientOutputAmount'          = 707,
    'PairAlreadyExists'                 = 708,
    'TooLongSwapRoute'                  = 709,

    // emission coin
    'CoinIsNotToken'                    = 800,
    'CoinNotMintable'                   = 801,
    'CoinNotBurnable'                   = 802,
}

const mustacheHelpers = {
    formatBip: () => (n, render) => utils.format.formatBipAmount(render(n)),
};

export class ServerError extends TypedError {
}

class ServerTransactionError extends ServerError {
    public transaction: any;
}

export function parseRpcError(errorObj: Record<string, any>): ServerError {
    const result = {};
    const errorClassName = walkSubtype(errorObj, schema.schema, result, '');
    // NOTE: This assumes that all errors extend TypedError
    const error = new ServerError(formatError(errorClassName, result), errorClassName);
    Object.assign(error, result);
    return error;
}

export function parseResultError(result: any): ServerTransactionError {
    const server_error = parseRpcError(result);
    const server_tx_error = new ServerTransactionError();
    Object.assign(server_tx_error, server_error);
    server_tx_error.type = server_error.type;
    server_tx_error.message = server_error.message;
    server_tx_error.transaction = result.transaction_outcome;
    return server_tx_error;
}

export function formatError(errorClassName: string, errorData): string {
    if (typeof messages[errorClassName] === 'string') {
        return Mustache.render(messages[errorClassName], {
            ...errorData,
            ...mustacheHelpers,
        });
    }
    return JSON.stringify(errorData);
}

/**
 * Walks through defined schema returning error(s) recursively
 * @param errorObj The error to be parsed
 * @param schema A defined schema in JSON mapping to the RPC errors
 * @param result An object used in recursion or called directly
 * @param typeName The human-readable error type name as defined in the JSON mapping
 */
function walkSubtype(errorObj, schema, result, typeName) {
    let error;
    let type;
    let errorTypeName;
    for (const errorCode in schema) {
        if (isString(errorObj.code == errorCode)) {
            // Return early if error type is in a schema
            return errorObj[errorCode];
        }
        if (isObject(errorObj[errorCode])) {
            error = errorObj[errorCode];
            type = schema[errorCode];
            errorTypeName = errorCode;
        } else if (isObject(errorObj.kind) && isObject(errorObj.kind[errorCode])) {
            error = errorObj.kind[errorCode];
            type = schema[errorCode];
            errorTypeName = errorCode;
        } else {
            continue;
        }
    }
    if (error && type) {
        for (const prop of Object.keys(type.props)) {
            result[prop] = error[prop];
        }
        return walkSubtype(error, schema, result, errorTypeName);
    } else {
        // TODO: is this the right thing to do?
        result.kind = errorObj;
        return typeName;
    }
}

export function getErrorTypeFromErrorMessage(errorMessage) {
    // This function should be removed when JSON RPC starts returning typed errors.
    switch (true) {
    case /^account .*? does not exist while viewing$/.test(errorMessage):
        return 'AccountDoesNotExist';
    case /^Account .*? doesn't exist$/.test(errorMessage):
        return 'AccountDoesNotExist';
    case /^access key .*? does not exist while viewing$/.test(errorMessage):
        return 'AccessKeyDoesNotExist';
    case /wasm execution failed with error: FunctionCallError\(CompilationError\(CodeDoesNotExist/.test(
        errorMessage):
        return 'CodeDoesNotExist';
    case /Transaction nonce \d+ must be larger than nonce of the used access key \d+/.test(errorMessage):
        return 'InvalidNonce';
    default:
        return 'UntypedError';
    }
}

/**
 * Helper function determining if the argument is an object
 * @param n Value to check
 */
function isObject(n) {
    return Object.prototype.toString.call(n) === '[object Object]';
}

/**
 * Helper function determining if the argument is a string
 * @param n Value to check
 */
function isString(n) {
    return Object.prototype.toString.call(n) === '[object String]';
}
