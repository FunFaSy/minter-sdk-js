// RPC Entities

type BlockHash = string;
type BlockHeight = number;
export type BlockId = BlockHash | BlockHeight;
export type BlockReference =
    { blockId: BlockId }
    | { sync_checkpoint: 'genesis' | 'earliest_available' | 'latest' }


//-----------  Blockchain
export interface TransactionResponse {
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

export interface BlockRequest {[key: string]: any}

export interface BlockResult {[key: string]: any}

export interface BlocksRequest {[key: string]: any}

export interface BlocksResult {[key: string]: any}

export interface GenesisRequest {[key: string]: any}

export interface NetInfoResult {[key: string]: any}

export interface SendTransactionRequest {[key: string]: any}

export interface SendTransactionResult {[key: string]: any}

export interface TransactionRequest {[key: string]: any}

export interface TransactionResult {[key: string]: any}

export interface TransactionsRequest {[key: string]: any}

export interface TransactionsResult {[key: string]: any}

export interface UnconfirmedTxsRequest {[key: string]: any}

export interface UnconfirmedTxsResult {[key: string]: any}

export interface NodeStatusResult {[key: string]: any}

//----------- Account
export interface AddressStateRequest {[key: string]: any}

export interface AddressStateResult {[key: string]: any}

export interface AdressesRequest {[key: string]: any}

export interface AdressesResult {[key: string]: any}

export interface AddressFrozenResult {[key: string]: any}

export interface AddressFrozenRequest {[key: string]: any}

export interface AddressWaitListRequest {[key: string]: any}

export interface AddressWaitListResult {[key: string]: any}

export interface VersionNetworkResult {[key: string]: any}

//----------- Validator
export interface CandidateRequest {[key: string]: any}

export interface CandidateResult {[key: string]: any}

export interface CandidatesRequest {[key: string]: any}

export interface CandidatesResult {[key: string]: any}

export interface MissedBlocksRequest {[key: string]: any}

export interface MissedBlocksResult {[key: string]: any}

export interface ValidatorsRequest {[key: string]: any}

export interface ValidatorsResult {[key: string]: any}

//----------- Coins/Tokens
export interface CoinInfoRequest {[key: string]: any}

export interface CoinInfoResult {[key: string]: any}

export interface CoinInfoByIdRequest {[key: string]: any}

export interface CoinInfoByIdResult {[key: string]: any}

export interface EstimateCoinBuyRequest {[key: string]: any}

export interface EstimateCoinBuyResult {[key: string]: any}

export interface EstimateCoinSellRequest {[key: string]: any}

export interface EstimateCoinSellResult {[key: string]: any}

export interface EstimateCoinSellAllRequest {[key: string]: any}

export interface EstimateCoinSellAllResult {[key: string]: any}

//----------- Orders
export interface LimitOrderRequest {[key: string]: any}

export interface LimitOrderResult {[key: string]: any}

export interface LimitOrdersRequest {[key: string]: any}

export interface LimitOrdersResult {[key: string]: any}

//----------- SwapPools
export interface SwapPoolRequest {[key: string]: any}

export interface SwapPoolResult {[key: string]: any}

//----------- Vote (GOVERNESS)
export interface VoteCommissionRequest {[key: string]: any}

export interface VoteCommissionResult {[key: string]: any}

export interface VoteHaltRequest {[key: string]: any}

export interface VoteHaltResult {[key: string]: any}

export interface VoteNetUpdateRequest {[key: string]: any}

export interface VoteNetUpdateResult {[key: string]: any}

//----------- Price
export interface EstimateTxCommissionRequest {[key: string]: any}

export interface EstimateTxCommissionResult {[key: string]: any}

export interface MinGasPriceRequest {[key: string]: any}

export interface MinGasPriceResult {[key: string]: any}

export interface MaxGasPriceRequest {[key: string]: any}

export interface MaxGasPriceResult {[key: string]: any}

export interface PriceCommissionsRequest {[key: string]: any}

export interface PriceCommissionsResult {[key: string]: any}

//----------- Events
export interface EventsRequest {[key: string]: any}

export interface EventsResult {[key: string]: any}

//----------- WebSockets

//----------- Queries
export interface RpcQueryRequest {[key: string]: any}

export interface QueryResponseKind {[key: string]: any}



// Resources (@link (https://github.com/MinterTeam/node-grpc-gateway/blob/master/resources.proto)
export interface Coin {
    id: number;
    symbol: string;
}
