/**
 * MINTER RPC API request types and responses
 * @module
 */
import * as rpcTypes from './types';

/** @hidden (@link https://github.com/MinterTeam/node-grpc-gateway/blob/master/api.proto)*/
export abstract class Provider {

    // rpc Halts (HaltsRequest) returns (HaltsResponse)
    //
    //-----------  Blockchain
    abstract getBlock(params: rpcTypes.BlockRequest): Promise<rpcTypes.BlockResult>;

    abstract getBlocks(params: rpcTypes.BlocksRequest): Promise<rpcTypes.BlocksResult>;

    abstract getGenesis(): Promise<rpcTypes.GenesisRequest>;

    abstract getNetInfo(): Promise<rpcTypes.NetInfoResult>;

    abstract sendTransaction(params: rpcTypes.SendTransactionRequest): Promise<rpcTypes.SendTransactionResult>;

    abstract getStatus(): Promise<rpcTypes.NodeStatusResult>;

    abstract getTransaction(params: rpcTypes.TransactionRequest): Promise<rpcTypes.TransactionResult>;

    abstract getTransactions(params: rpcTypes.TransactionsRequest): Promise<rpcTypes.TransactionsResult>;

    abstract getUnconfirmedTransactions(params: rpcTypes.UnconfirmedTxsRequest): Promise<rpcTypes.UnconfirmedTxsResult>;

    abstract getVersionNetwork(): Promise<rpcTypes.VersionNetworkResult>;

    //----------- Account
    abstract getAddress(params: rpcTypes.AddressStateRequest): Promise<rpcTypes.AddressStateResult>;

    abstract getAddresses(params: rpcTypes.AdressesRequest): Promise<rpcTypes.AdressesResult>;

    abstract getFrozen(params: rpcTypes.AddressFrozenRequest): Promise<rpcTypes.AddressFrozenResult>;

    abstract getWaitlist(params: rpcTypes.AddressWaitListRequest): Promise<rpcTypes.AddressWaitListResult>;

    //----------- Validator
    abstract getCandidate(params: rpcTypes.CandidateRequest): Promise<rpcTypes.CandidateResult>;

    abstract getCandidates(params: rpcTypes.CandidatesRequest): Promise<rpcTypes.CandidatesResult>;

    abstract getMissedBlocks(params: rpcTypes.MissedBlocksRequest): Promise<rpcTypes.MissedBlocksResult>;

    abstract getValidators(params: rpcTypes.ValidatorsRequest): Promise<rpcTypes.ValidatorsResult>;

    //----------- Coins/Tokens
    abstract getCoinInfo(params: rpcTypes.CoinInfoRequest): Promise<rpcTypes.CoinInfoResult>;

    abstract getCoinInfoById(params: rpcTypes.CoinInfoByIdRequest): Promise<rpcTypes.CoinInfoByIdResult>;

    abstract estimateCoinBuy(params: rpcTypes.EstimateCoinBuyRequest): Promise<rpcTypes.EstimateCoinBuyResult>;

    abstract estimateCoinSell(params: rpcTypes.EstimateCoinSellRequest): Promise<rpcTypes.EstimateCoinSellResult>;

    abstract estimateCoinSellAll(params: rpcTypes.EstimateCoinSellAllRequest): Promise<rpcTypes.EstimateCoinSellAllResult>;

    //----------- Orders
    abstract getLimitOrder(params: rpcTypes.LimitOrderRequest): Promise<rpcTypes.LimitOrderResult>;

    abstract getLimitOrders(params: rpcTypes.LimitOrdersRequest): Promise<rpcTypes.LimitOrdersResult>;

    //----------- SwapPools
    abstract getSwapPool(params: rpcTypes.SwapPoolRequest): Promise<rpcTypes.SwapPoolResult>;

    //----------- Vote (GOVERNESS) Info
    abstract getVoteCommission(params: rpcTypes.VoteCommissionRequest): Promise<rpcTypes.VoteCommissionResult>;

    abstract getVoteHalt(params: rpcTypes.VoteHaltRequest): Promise<rpcTypes.VoteHaltResult>;

    abstract getVoteNetUpdate(params: rpcTypes.VoteNetUpdateRequest): Promise<rpcTypes.VoteNetUpdateResult>;

    //----------- Prices
    abstract estimateTxCommission(params: rpcTypes.EstimateTxCommissionRequest): Promise<rpcTypes.EstimateTxCommissionResult>;

    abstract getMinGasPrice(params: rpcTypes.MinGasPriceRequest): Promise<rpcTypes.MinGasPriceResult>;

    abstract getMaxGasPrice(params: rpcTypes.MaxGasPriceRequest): Promise<rpcTypes.MaxGasPriceResult>;

    abstract getPriceCommissions(params: rpcTypes.PriceCommissionsRequest): Promise<rpcTypes.PriceCommissionsResult>;

    //----------- Events
    abstract getEvents(params: rpcTypes.EventsRequest): Promise<rpcTypes.EventsResult>;

    //
    //-----------  WebSockets
    // abstract  Subscribe (SubscribeRequest) returns (stream SubscribeResponse)

    //----------- Queries
    abstract query<T extends rpcTypes.QueryResponseKind>(params: rpcTypes.RpcQueryRequest): Promise<T>;

    // abstract query<T extends QueryResponseKind>(path: string, data: string): Promise<T>;

}
