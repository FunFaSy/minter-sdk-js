// RPC Entities

type BlockHash = string;
type BlockHeight = number;
export type BlockId = BlockHash | BlockHeight;
export type BlockReference =
    { blockId: BlockId }
    | { syncCheckpoint: 'genesis' | 'earliest_available' | 'latest' }
// Resources (@link (https://github.com/MinterTeam/node-grpc-gateway/blob/master/resources.proto)
export type Coin = { id: string; symbol: string };

export type BlockFields =
    | 'transactions'
    | 'missed'
    | 'block_reward'
    | 'size'
    | 'proposer'
    | 'validators'
    | 'evidence';

export enum CandidatesStatusEnum {
    'ALL' = 'all',
    'ON'  = 'on',
    'OFF' = 'off',
}

export enum SwapAlgoEnum {
    'OPTIMAL' = 'optimal',
    'BANCOR'  = 'bancor',
    'POOL'    = 'pool',
}

//----------- Queries
export interface RpcQueryRequest {[key: string]: any}

export interface RpcQueryResponse {[key: string]: any}

//-----------  Blockchain

export interface BlockRequest extends RpcQueryRequest {
    height: number;
    fields?: BlockFields[];
    failedTxs?: boolean;
}

export interface BlockResponse extends RpcQueryResponse {[key: string]: any}

export interface BlocksRequest extends RpcQueryRequest {
    fromHeight: number;
    toHeight: number;
    fields?: BlockFields[];
    failedTxs?: boolean;
}

export interface BlocksResponse extends RpcQueryResponse {[key: string]: any}

export interface GenesisResponse extends RpcQueryResponse {[key: string]: any}

export interface NetInfoResponse extends RpcQueryResponse {[key: string]: any}

export interface SendTransactionRequest extends RpcQueryRequest {
    tx: string;
}

export interface SendTransactionResponse extends RpcQueryResponse {[key: string]: any}

export interface TransactionRequest extends RpcQueryRequest {
    hash: string;
}

export interface TransactionResponse extends RpcQueryResponse {
    hash: string;
    raw_tx: string;
    height: string;
    index: string;
    from: string;
    nonce: string;
    gas: string;
    gas_price: string;
    gas_coin: string;
    type: string;
    data: any;
    payload: string;
    tags: { [key: string]: any };
    code: string;
    log: string;
}

export interface TransactionsRequest extends RpcQueryRequest {
    query: string;
    page?: number;
    perPage?: number;
}

export interface TransactionsResponse extends RpcQueryResponse {[key: string]: any}

export interface UnconfirmedTxsRequest extends RpcQueryRequest {
    limit?: number;
}

export interface UnconfirmedTxsResponse extends RpcQueryResponse {[key: string]: any}

export interface NodeStatusResponse extends RpcQueryResponse {[key: string]: any}

//----------- Account
export interface AddressStateRequest extends RpcQueryRequest {
    address: string;
    height?: number;
    delegated?: boolean;
}

export interface AddressStateResponse extends RpcQueryResponse {[key: string]: any}

export interface AddressesRequest extends RpcQueryRequest {
    addresses: string[];
    height?: number;
    delegated?: boolean;
}

export interface AddressesResponse extends RpcQueryResponse {[key: string]: any}

export interface AddressFrozenResponse extends RpcQueryResponse {[key: string]: any}

export interface AddressFrozenRequest extends RpcQueryRequest {
    address: string;
    height?: number;
    coinId?: number;
}

export interface AddressWaitListRequest extends RpcQueryRequest {
    address: string;
    height?: number;
    publicKey?: number;
}

export interface AddressWaitListResponse extends RpcQueryResponse {[key: string]: any}

export interface NetworkVersionResponse extends RpcQueryResponse {[key: string]: any}

//----------- Validator
export interface CandidateRequest extends RpcQueryRequest {
    publicKey: string;
    height?: number;
    showStakes?: boolean;
}

export interface CandidateResponse extends RpcQueryResponse {[key: string]: any}

export interface CandidatesRequest extends RpcQueryRequest {
    height?: number;
    includeStakes?: boolean;
    showStakes?: boolean;
    status?: CandidatesStatusEnum;
}

export interface CandidatesResponse extends RpcQueryResponse {[key: string]: any}

export interface MissedBlocksRequest extends RpcQueryRequest {
    publicKey: string;
    height?: number;
}

export interface MissedBlocksResponse extends RpcQueryResponse {[key: string]: any}

export interface ValidatorsRequest extends RpcQueryRequest {
    height?: number;
}

export interface ValidatorsResponse extends RpcQueryResponse {[key: string]: any}

//----------- Coins/Tokens
export interface CoinInfoRequest extends RpcQueryRequest {
    symbol: string;
    height?: number;
}

export interface CoinInfoResponse extends RpcQueryResponse {[key: string]: any}

export interface CoinInfoByIdRequest extends RpcQueryRequest {
    id: number;
    height?: number;
}

export interface CoinInfoByIdResponse extends RpcQueryResponse {[key: string]: any}

export interface EstimateCoinBuyRequest extends RpcQueryRequest {
    coinIdToBuy?: number;
    coinToBuy?: string;
    coinIdToSell?: number;
    coinToSell?: string;
    valueToBuy: string | number;
    height?: number;
    coinIdCommission?: number;
    coinCommission?: string;
    swapFrom?: SwapAlgoEnum; // -Default value : optimal
    route?: number[] | string[];
}

export interface EstimateCoinBuyResponse extends RpcQueryResponse {
    will_pay: string;
    commission: string;
    swap_from: string;
}

export interface EstimateCoinSellRequest extends RpcQueryRequest {
    coinIdToBuy?: number;
    coinToBuy?: string;
    coinIdToSell?: number;
    coinToSell?: string;
    valueToSell: string | number;
    height?: number;
    coinIdCommission?: number;
    coinCommission?: string;
    swapFrom?: SwapAlgoEnum; // -Default value : optimal
    route?: number[] | string[];
}

export interface EstimateCoinSellResponse extends RpcQueryResponse {
    will_get: string;
    commission: string;
    swap_from: string;
}

export interface EstimateCoinSellAllRequest extends RpcQueryRequest {
    coinIdToBuy?: number;
    coinToBuy?: string;
    coinIdToSell?: number;
    coinToSell?: string;
    valueToSell: string | number;
    gasPrice?: number; //	Default value : 1
    height?: number;
    swapFrom?: SwapAlgoEnum; // -Default value : optimal
    route?: number[] | string[];
}

export interface EstimateCoinSellAllResponse extends RpcQueryResponse {
    will_get: string;
    swap_from: string;
}

//----------- Orders
export interface LimitOrderRequest extends RpcQueryRequest {
    orderId: number;
    height?: number;
}

export interface LimitOrderResponse extends RpcQueryResponse {
    coin_buy: Coin;
    coin_sell: Coin;
    height: string;
    id: string;
    owner: string;
    price: string;
    want_buy: string;
    want_sell: string;
}

export interface LimitOrdersRequest extends RpcQueryRequest {
    ids: number[];
    height?: number;
}

export interface LimitOrdersResponse extends RpcQueryResponse {
    orders: LimitOrderResponse[];
}

//----------- SwapPools
export interface SwapPoolRequest extends RpcQueryRequest {
    coin0: number;
    coin1: number;
    height?: number;
    provider?: string; // pub key
}

export interface SwapPoolResponse extends RpcQueryResponse {
    amount0: string;
    amount1: string;
    liquidity: string;
    price: string;
}

//----------- Vote (GOVERNESS)
export interface CommissionVotesRequest extends RpcQueryRequest {
    targetVersion: string;
    height?: number;
}

export interface CommissionVotesResponse extends RpcQueryResponse {
    price: {
        coin: Coin;
        payload_byte: string;
        send: string;
        buy_bancor: string;
        sell_bancor: string;
        sell_all_bancor: string;
        buy_pool_base: string;
        buy_pool_delta: string;
        sell_pool_base: string;
        sell_pool_delta: string;
        sell_all_pool_base: string;
        sell_all_pool_delta: string;
        create_ticker3: string;
        create_ticker4: string;
        create_ticker5: string;
        create_ticker6: string;
        create_ticker7_10: string;
        create_coin: string;
        create_token: string;
        recreate_coin: string;
        recreate_token: string;
        declare_candidacy: string;
        delegate: string;
        unbond: string;
        redeem_check: string;
        set_candidate_on: string;
        set_candidate_off: string;
        create_multisig: string;
        multisend_base: string;
        multisend_delta: string;
        edit_candidate: string;
        set_halt_block: string;
        edit_ticker_owner: string;
        edit_multisig: string;
        edit_candidate_public_key: string;
        create_swap_pool: string;
        add_liquidity: string;
        remove_liquidity: string;
        edit_candidate_commission: string;
        mint_token: string;
        burn_token: string;
        vote_commission: string;
        vote_update: string;
        failed_tx: string;
    };
    public_keys: string[];
}

export interface HaltVotesRequest extends RpcQueryRequest {
    height?: number;
}

export interface HaltVotesResponse extends RpcQueryResponse {
    publicKeys: string[];
}

export interface NetUpdateVotesRequest extends RpcQueryRequest {
    targetVersion: string;
    height?: number;
}

export interface NetUpdateVotesResponse extends RpcQueryResponse {
    votes: { version: string; public_keys: string[] }[];
}

//----------- Price
export interface EstimateTxCommissionRequest extends RpcQueryRequest {
    tx: string;
}

export interface EstimateTxCommissionResponse extends RpcQueryResponse {[key: string]: any}

export interface MinGasPriceRequest extends RpcQueryRequest {[key: string]: any}

export interface MinGasPriceResponse extends RpcQueryResponse {
    min_gas_price: string;
}

export interface MaxGasPriceRequest extends RpcQueryRequest {
    height?: number;
}

export interface MaxGasPriceResponse extends RpcQueryResponse {
    max_gas_price: string;
}

export interface PriceCommissionsRequest extends RpcQueryRequest {
    height?: number;
}

export interface PriceCommissionsResponse extends RpcQueryResponse {
    coin: Coin;
    payload_byte: string;
    send: string;
    buy_bancor: string;
    sell_bancor: string;
    sell_all_bancor: string;
    buy_pool_base: string;
    buy_pool_delta: string;
    sell_pool_base: string;
    sell_pool_delta: string;
    sell_all_pool_base: string;
    sell_all_pool_delta: string;
    create_ticker3: string;
    create_ticker4: string;
    create_ticker5: string;
    create_ticker6: string;
    create_ticker7_10: string;
    create_coin: string;
    create_token: string;
    recreate_coin: string;
    recreate_token: string;
    declare_candidacy: string;
    delegate: string;
    unbond: string;
    redeem_check: string;
    set_candidate_on: string;
    set_candidate_off: string;
    create_multisig: string;
    multisend_base: string;
    multisend_delta: string;
    edit_candidate: string;
    set_halt_block: string;
    edit_ticker_owner: string;
    edit_multisig: string;
    edit_candidate_public_key: string;
    create_swap_pool: string;
    add_liquidity: string;
    remove_liquidity: string;
    edit_candidate_commission: string;
    mint_token: string;
    burn_token: string;
    vote_commission: string;
    vote_update: string;
    failed_tx: string;

}

//----------- Events
export interface EventsRequest extends RpcQueryRequest {
    height?: number;
}

export interface EventsResponse extends RpcQueryResponse {
    events: { [key: string]: any }[];
}

//----------- WebSockets


