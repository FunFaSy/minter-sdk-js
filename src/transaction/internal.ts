/**
 * circular dependency issue Fix.
 * !!! Important values case-sensitive
 * @see (https://medium.com/visual-development/how-to-fix-nasty-circular-dependency-issues-once-and-for-all-in-javascript-typescript-a04c987cf0de)
 */
export enum TransactionType {
    SEND                      = '0x01',
    SELL                      = '0x02',
    SELL_ALL                  = '0x03',
    BUY                       = '0x04',
    CREATE_COIN               = '0x05',
    DECLARE_CANDIDACY         = '0x06',
    DELEGATE                  = '0x07',
    UNBOND                    = '0x08',
    REDEEM_CHECK              = '0x09',
    SET_CANDIDATE_ON          = '0x0A',
    SET_CANDIDATE_OFF         = '0x0B',
    CREATE_MULTISIG           = '0x0C',
    MULTISEND                 = '0x0D',
    EDIT_CANDIDATE            = '0x0E',
    SET_HALT_BLOCK            = '0x0F',
    RECREATE_COIN             = '0x10',
    EDIT_TICKER_OWNER         = '0x11',
    EDIT_MULTISIG             = '0x12',
    PRICE_VOTE                = '0x13',
    EDIT_CANDIDATE_PUBLIC_KEY = '0x14',
    ADD_LIQUIDITY             = '0x15',
    REMOVE_LIQUIDITY          = '0x16',
    SELL_SWAP_POOL            = '0x17',
    BUY_SWAP_POOL             = '0x18',
    SELL_ALL_SWAP_POOL        = '0x19',
    EDIT_CANDIDATE_COMMISSION = '0x1A',
    MOVE_STAKE                = '0x1B',
    MINT_TOKEN                = '0x1C',
    BURN_TOKEN                = '0x1D',
    CREATE_TOKEN              = '0x1E',
    RECREATE_TOKEN            = '0x1F',
    VOTE_COMMISSION           = '0x20',
    VOTE_UPDATE               = '0x21',
    CREATE_SWAP_POOL          = '0x22',
    ADD_LIMIT_ORDER           = '0x23',
    REMOVE_LIMIT_ORDER        = '0x24'

}

