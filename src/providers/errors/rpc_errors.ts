import Mustache from 'mustache';
import * as messages from './error_messages.json';
import {TypedError} from '../../util/errors';
import {formatBipAmount, isObject, isString} from '../../util';

/**
 * MINTER  have no standardised ERRORS even codes tells nothing.
 *
 */
const mustacheHelpers = {
  formatBip: () => (n, render) => formatBipAmount(render(n)),
};

export class ServerError extends TypedError {
}

export class ServerTransactionError extends ServerError {
    public transaction: string;
}

/** !!! Codes tells nothing! Different errors can have same code*/

// https://github.com/MinterTeam/minter-go-node/blob/master/coreV2/code/code.go#L8
export enum ServerErrorCode {
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

    'TxNotFound'                        = 400,

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

export function parseRpcError(errorObj: Record<string, any>): ServerError {
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

export function parseTransactionResultError(result: any): ServerTransactionError {
  const server_error = parseRpcError(result.error);
  const server_tx_error = new ServerTransactionError();
  Object.assign(server_tx_error, server_error);

  server_tx_error.type = server_error.type;
  server_tx_error.message = server_error.message;
  server_tx_error.transaction = result.hash;

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
const walkSubtype = function(errorObj, schema, result, typeName) {
  let error;
  let type;
  let errorTypeName;
  for (const errorName in schema) {
    if (isString(errorObj[errorName])) {
      // Return early if error type is in a schema
      return errorObj[errorName];
    }
    if (isObject(errorObj[errorName])) {
      error = errorObj[errorName];
      type = schema[errorName];
      errorTypeName = errorName;
    } else if (isObject(errorObj.kind) && isObject(errorObj.kind[errorName])) {
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
  } else {
    // TODO: is this the right thing to do?
    result.kind = errorObj;
    return typeName;
  }
};

export function getErrorTypeFromErrorMessage(errorMessage) {
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

export function getErrorTypeFromErrorCode(code: string): string {
  // This function should be removed when JSON RPC starts returning typed errors.
  switch (true) {
  case ServerErrorCode[code]:
    return ServerErrorCode[code];
  default:
    return 'UnknownServerError';
  }
}

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
