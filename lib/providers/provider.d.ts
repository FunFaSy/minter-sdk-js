/**
 * MINTER RPC API request types and responses
 * @module
 */
import * as rpcTypes from './internal';
/** @hidden (@link https://github.com/MinterTeam/node-grpc-gateway/blob/master/api.proto)*/
export declare abstract class Provider {
    abstract block(params: rpcTypes.BlockRequest): Promise<rpcTypes.BlockResponse>;
    abstract blocks(params: rpcTypes.BlocksRequest): Promise<rpcTypes.BlocksResponse>;
    abstract genesis(): Promise<rpcTypes.GenesisResponse>;
    abstract netInfo(): Promise<rpcTypes.NetInfoResponse>;
    abstract sendTransaction(params: rpcTypes.SendTransactionRequest): Promise<rpcTypes.SendTransactionResponse>;
    abstract status(): Promise<rpcTypes.NodeStatusResponse>;
    abstract transaction(params: rpcTypes.TransactionRequest): Promise<rpcTypes.TransactionResponse>;
    abstract transactions(params: rpcTypes.TransactionsRequest): Promise<rpcTypes.TransactionsResponse>;
    abstract unconfirmedTransactions(params: rpcTypes.UnconfirmedTxsRequest): Promise<rpcTypes.UnconfirmedTxsResponse>;
    abstract networkVersion(): Promise<rpcTypes.NetworkVersionResponse>;
    abstract address(params: rpcTypes.AddressStateRequest): Promise<rpcTypes.AddressStateResponse>;
    abstract addresses(params: rpcTypes.AddressesRequest): Promise<rpcTypes.AddressesResponse>;
    abstract frozen(params: rpcTypes.AddressFrozenRequest): Promise<rpcTypes.AddressFrozenResponse>;
    abstract waitlist(params: rpcTypes.AddressWaitListRequest): Promise<rpcTypes.AddressWaitListResponse>;
    abstract candidate(params: rpcTypes.CandidateRequest): Promise<rpcTypes.CandidateResponse>;
    abstract candidates(params?: rpcTypes.CandidatesRequest): Promise<rpcTypes.CandidatesResponse>;
    abstract missedBlocks(params: rpcTypes.MissedBlocksRequest): Promise<rpcTypes.MissedBlocksResponse>;
    abstract validators(params: rpcTypes.ValidatorsRequest): Promise<rpcTypes.ValidatorsResponse>;
    abstract coinInfo(params: rpcTypes.CoinInfoRequest): Promise<rpcTypes.CoinInfoResponse>;
    abstract coinInfoById(params: rpcTypes.CoinInfoByIdRequest): Promise<rpcTypes.CoinInfoByIdResponse>;
    abstract estimateCoinBuy(params: rpcTypes.EstimateCoinBuyRequest): Promise<rpcTypes.EstimateCoinBuyResponse>;
    abstract estimateCoinSell(params: rpcTypes.EstimateCoinSellRequest): Promise<rpcTypes.EstimateCoinSellResponse>;
    abstract estimateCoinSellAll(params: rpcTypes.EstimateCoinSellAllRequest): Promise<rpcTypes.EstimateCoinSellAllResponse>;
    abstract limitOrder(params: rpcTypes.LimitOrderRequest): Promise<rpcTypes.LimitOrderResponse>;
    abstract limitOrders(params: rpcTypes.LimitOrdersRequest): Promise<rpcTypes.LimitOrdersResponse>;
    abstract swapPool(params: rpcTypes.SwapPoolRequest): Promise<rpcTypes.SwapPoolResponse>;
    abstract estimateTxCommission(params: rpcTypes.EstimateTxCommissionRequest): Promise<rpcTypes.EstimateTxCommissionResponse>;
    abstract minGasPrice(params?: rpcTypes.MinGasPriceRequest): Promise<rpcTypes.MinGasPriceResponse>;
    abstract maxGasPrice(params?: rpcTypes.MaxGasPriceRequest): Promise<rpcTypes.MaxGasPriceResponse>;
    abstract priceCommissions(params?: rpcTypes.PriceCommissionsRequest): Promise<rpcTypes.PriceCommissionsResponse>;
    abstract commissionVotes(params: rpcTypes.CommissionVotesRequest): Promise<rpcTypes.CommissionVotesResponse>;
    abstract haltVotes(params: rpcTypes.HaltVotesRequest): Promise<rpcTypes.HaltVotesResponse>;
    abstract netUpdateVotes(params: rpcTypes.NetUpdateVotesRequest): Promise<rpcTypes.NetUpdateVotesResponse>;
    abstract events(params: rpcTypes.EventsRequest): Promise<rpcTypes.EventsResponse>;
}
