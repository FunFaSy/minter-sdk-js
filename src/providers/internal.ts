// RPC Entities

type BlockHash = string;
type BlockHeight = number;
export type BlockId = BlockHash | BlockHeight;
export type BlockReference =
    { blockId: BlockId }
    | { syncCheckpoint: 'genesis' | 'earliest_available' | 'latest' }

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
    fields: BlockFields[];
    failedTxs: boolean;
}

export interface BlockResponse extends RpcQueryResponse {[key: string]: any}

export interface BlocksRequest extends RpcQueryRequest {
    fields: BlockFields[];
    failedTxs: boolean;
}

export interface BlocksResponse extends RpcQueryResponse {[key: string]: any}

export interface GenesisResponse extends RpcQueryResponse {[key: string]: any}

export interface NetInfoResponse extends RpcQueryResponse {[key: string]: any}

export interface SendTransactionRequest extends RpcQueryRequest {
    tx: string;
}

export interface SendTransactionResponse extends RpcQueryResponse {[key: string]: any}

export interface TransactionRequest extends RpcQueryRequest {[key: string]: any}

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
    page: number;
    perPage: number;
}

export interface TransactionsResponse extends RpcQueryResponse {[key: string]: any}

export interface UnconfirmedTxsRequest extends RpcQueryRequest {
    limit: number;
}

export interface UnconfirmedTxsResponse extends RpcQueryResponse {[key: string]: any}

export interface NodeStatusResponse extends RpcQueryResponse {[key: string]: any}

//----------- Account
export interface AddressStateRequest extends RpcQueryRequest {
    height: number;
    delegated: boolean;
}

export interface AddressStateResponse extends RpcQueryResponse {[key: string]: any}

export interface AdressesRequest extends RpcQueryRequest {
    height: number;
    delegated: boolean;
}

export interface AdressesResponse extends RpcQueryResponse {[key: string]: any}

export interface AddressFrozenResponse extends RpcQueryResponse {[key: string]: any}

export interface AddressFrozenRequest extends RpcQueryRequest {
    height: number;
    coinId: number;
}

export interface AddressWaitListRequest extends RpcQueryRequest {
    height: number;
    publicKey: number;
}

export interface AddressWaitListResponse extends RpcQueryResponse {[key: string]: any}

export interface NetworkVersionResponse extends RpcQueryResponse {[key: string]: any}

//----------- Validator
export interface CandidateRequest extends RpcQueryRequest {
    height: number;
    showStakes: boolean;
}

export interface CandidateResponse extends RpcQueryResponse {[key: string]: any}

export interface CandidatesRequest extends RpcQueryRequest {
    height: number;
    includeStakes: boolean;
    showStakes: boolean;
    status: CandidatesStatusEnum;
}

export interface CandidatesResponse extends RpcQueryResponse {[key: string]: any}

export interface MissedBlocksRequest extends RpcQueryRequest {[key: string]: any}

export interface MissedBlocksResponse extends RpcQueryResponse {[key: string]: any}

export interface ValidatorsRequest extends RpcQueryRequest {[key: string]: any}

export interface ValidatorsResponse extends RpcQueryResponse {[key: string]: any}

//----------- Coins/Tokens
export interface CoinInfoRequest extends RpcQueryRequest {[key: string]: any}

export interface CoinInfoResponse extends RpcQueryResponse {[key: string]: any}

export interface CoinInfoByIdRequest extends RpcQueryRequest {[key: string]: any}

export interface CoinInfoByIdResponse extends RpcQueryResponse {[key: string]: any}

export interface EstimateCoinBuyRequest extends RpcQueryRequest {[key: string]: any}

export interface EstimateCoinBuyResponse extends RpcQueryResponse {[key: string]: any}

export interface EstimateCoinSellRequest extends RpcQueryRequest {[key: string]: any}

export interface EstimateCoinSellResponse extends RpcQueryResponse {[key: string]: any}

export interface EstimateCoinSellAllRequest extends RpcQueryRequest {[key: string]: any}

export interface EstimateCoinSellAllResponse extends RpcQueryResponse {[key: string]: any}

//----------- Orders
export interface LimitOrderRequest extends RpcQueryRequest {[key: string]: any}

export interface LimitOrderResponse extends RpcQueryResponse {[key: string]: any}

export interface LimitOrdersRequest extends RpcQueryRequest {[key: string]: any}

export interface LimitOrdersResponse extends RpcQueryResponse {[key: string]: any}

//----------- SwapPools
export interface SwapPoolRequest extends RpcQueryRequest {[key: string]: any}

export interface SwapPoolResponse extends RpcQueryResponse {[key: string]: any}

//----------- Vote (GOVERNESS)
export interface VoteCommissionRequest extends RpcQueryRequest {[key: string]: any}

export interface VoteCommissionResponse extends RpcQueryResponse {[key: string]: any}

export interface VoteHaltRequest extends RpcQueryRequest {[key: string]: any}

export interface VoteHaltResponse extends RpcQueryResponse {[key: string]: any}

export interface VoteNetUpdateRequest extends RpcQueryRequest {[key: string]: any}

export interface VoteNetUpdateResponse extends RpcQueryResponse {[key: string]: any}

//----------- Price
export interface EstimateTxCommissionRequest extends RpcQueryRequest {[key: string]: any}

export interface EstimateTxCommissionResponse extends RpcQueryResponse {[key: string]: any}

export interface MinGasPriceRequest extends RpcQueryRequest {[key: string]: any}

export interface MinGasPriceResponse extends RpcQueryResponse {[key: string]: any}

export interface MaxGasPriceRequest extends RpcQueryRequest {[key: string]: any}

export interface MaxGasPriceResponse extends RpcQueryResponse {[key: string]: any}

export interface PriceCommissionsRequest extends RpcQueryRequest {[key: string]: any}

export interface PriceCommissionsResponse extends RpcQueryResponse {[key: string]: any}

//----------- Events
export interface EventsRequest extends RpcQueryRequest {[key: string]: any}

export interface EventsResponse extends RpcQueryResponse {[key: string]: any}

//----------- WebSockets

// Resources (@link (https://github.com/MinterTeam/node-grpc-gateway/blob/master/resources.proto)
export interface Coin {
    id: number;
    symbol: string;
}
