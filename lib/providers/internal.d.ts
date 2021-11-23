declare type BlockHash = string;
declare type BlockHeight = number;
export declare type BlockId = BlockHash | BlockHeight;
export declare type BlockReference = {
    blockId: BlockId;
} | {
    syncCheckpoint: 'genesis' | 'earliest_available' | 'latest';
};
export declare type Coin = {
    id: string;
    symbol: string;
};
export declare type BlockFields = 'transactions' | 'missed' | 'block_reward' | 'size' | 'proposer' | 'validators' | 'evidence';
export declare enum CandidatesStatusEnum {
    'ALL' = "all",
    'ON' = "on",
    'OFF' = "off"
}
export declare enum SwapAlgoEnum {
    'OPTIMAL' = "optimal",
    'BANCOR' = "bancor",
    'POOL' = "pool"
}
export interface RpcQueryRequest {
    [key: string]: any;
}
export interface RpcQueryResponse {
    [key: string]: any;
}
export interface BlockRequest extends RpcQueryRequest {
    fields: BlockFields[];
    failedTxs: boolean;
}
export interface BlockResponse extends RpcQueryResponse {
    [key: string]: any;
}
export interface BlocksRequest extends RpcQueryRequest {
    fields: BlockFields[];
    failedTxs: boolean;
}
export interface BlocksResponse extends RpcQueryResponse {
    [key: string]: any;
}
export interface GenesisResponse extends RpcQueryResponse {
    [key: string]: any;
}
export interface NetInfoResponse extends RpcQueryResponse {
    [key: string]: any;
}
export interface SendTransactionRequest extends RpcQueryRequest {
    tx: string;
}
export interface SendTransactionResponse extends RpcQueryResponse {
    [key: string]: any;
}
export interface TransactionRequest extends RpcQueryRequest {
    [key: string]: any;
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
    tags: {
        [key: string]: any;
    };
    code: string;
    log: string;
}
export interface TransactionsRequest extends RpcQueryRequest {
    page: number;
    perPage: number;
}
export interface TransactionsResponse extends RpcQueryResponse {
    [key: string]: any;
}
export interface UnconfirmedTxsRequest extends RpcQueryRequest {
    limit: number;
}
export interface UnconfirmedTxsResponse extends RpcQueryResponse {
    [key: string]: any;
}
export interface NodeStatusResponse extends RpcQueryResponse {
    [key: string]: any;
}
export interface AddressStateRequest extends RpcQueryRequest {
    height: number;
    delegated: boolean;
}
export interface AddressStateResponse extends RpcQueryResponse {
    [key: string]: any;
}
export interface AdressesRequest extends RpcQueryRequest {
    height: number;
    delegated: boolean;
}
export interface AdressesResponse extends RpcQueryResponse {
    [key: string]: any;
}
export interface AddressFrozenResponse extends RpcQueryResponse {
    [key: string]: any;
}
export interface AddressFrozenRequest extends RpcQueryRequest {
    height: number;
    coinId: number;
}
export interface AddressWaitListRequest extends RpcQueryRequest {
    height: number;
    publicKey: number;
}
export interface AddressWaitListResponse extends RpcQueryResponse {
    [key: string]: any;
}
export interface NetworkVersionResponse extends RpcQueryResponse {
    [key: string]: any;
}
export interface CandidateRequest extends RpcQueryRequest {
    height: number;
    showStakes: boolean;
}
export interface CandidateResponse extends RpcQueryResponse {
    [key: string]: any;
}
export interface CandidatesRequest extends RpcQueryRequest {
    height: number;
    includeStakes: boolean;
    showStakes: boolean;
    status: CandidatesStatusEnum;
}
export interface CandidatesResponse extends RpcQueryResponse {
    [key: string]: any;
}
export interface MissedBlocksRequest extends RpcQueryRequest {
    height: number;
}
export interface MissedBlocksResponse extends RpcQueryResponse {
    [key: string]: any;
}
export interface ValidatorsRequest extends RpcQueryRequest {
    height: number;
}
export interface ValidatorsResponse extends RpcQueryResponse {
    [key: string]: any;
}
export interface CoinInfoRequest extends RpcQueryRequest {
    height: number;
}
export interface CoinInfoResponse extends RpcQueryResponse {
    [key: string]: any;
}
export interface CoinInfoByIdRequest extends RpcQueryRequest {
    height: number;
}
export interface CoinInfoByIdResponse extends RpcQueryResponse {
    [key: string]: any;
}
export interface EstimateCoinBuyRequest extends RpcQueryRequest {
    coinIdToBuy?: number;
    coinToBuy?: string;
    coinIdToSell?: number;
    coinToSell?: string;
    valueToBuy: string | number;
    height?: number;
    coinIdCommission?: number;
    coinCommission?: string;
    swapFrom?: SwapAlgoEnum;
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
    swapFrom?: SwapAlgoEnum;
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
    gasPrice?: number;
    height?: number;
    swapFrom?: SwapAlgoEnum;
    route?: number[] | string[];
}
export interface EstimateCoinSellAllResponse extends RpcQueryResponse {
    will_get: string;
    swap_from: string;
}
export interface LimitOrderRequest extends RpcQueryRequest {
    height: number;
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
    height: number;
}
export interface LimitOrdersResponse extends RpcQueryResponse {
    orders: LimitOrderResponse[];
}
export interface SwapPoolRequest extends RpcQueryRequest {
    coin0: number;
    coin1: number;
    height?: number;
    provider?: string;
}
export interface SwapPoolResponse extends RpcQueryResponse {
    amount0: string;
    amount1: string;
    liquidity: string;
    price: string;
}
export interface VoteCommissionRequest extends RpcQueryRequest {
    [key: string]: any;
}
export interface VoteCommissionResponse extends RpcQueryResponse {
    [key: string]: any;
}
export interface VoteHaltRequest extends RpcQueryRequest {
    [key: string]: any;
}
export interface VoteHaltResponse extends RpcQueryResponse {
    [key: string]: any;
}
export interface VoteNetUpdateRequest extends RpcQueryRequest {
    [key: string]: any;
}
export interface VoteNetUpdateResponse extends RpcQueryResponse {
    [key: string]: any;
}
export interface EstimateTxCommissionRequest extends RpcQueryRequest {
    [key: string]: any;
}
export interface EstimateTxCommissionResponse extends RpcQueryResponse {
    [key: string]: any;
}
export interface MinGasPriceRequest extends RpcQueryRequest {
    [key: string]: any;
}
export interface MinGasPriceResponse extends RpcQueryResponse {
    [key: string]: any;
}
export interface MaxGasPriceRequest extends RpcQueryRequest {
    [key: string]: any;
}
export interface MaxGasPriceResponse extends RpcQueryResponse {
    [key: string]: any;
}
export interface PriceCommissionsRequest extends RpcQueryRequest {
    [key: string]: any;
}
export interface PriceCommissionsResponse extends RpcQueryResponse {
    [key: string]: any;
}
export interface EventsRequest extends RpcQueryRequest {
    [key: string]: any;
}
export interface EventsResponse extends RpcQueryResponse {
    [key: string]: any;
}
export {};
