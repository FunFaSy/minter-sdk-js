/**
 * MINTER RPC API request types and responses
 * @module
 */
import * as rpcTypes from './internal';

/** @hidden (@link https://github.com/MinterTeam/node-grpc-gateway/blob/master/api.proto)*/
export abstract class Provider {
    //-----------  Blockchain
    abstract block(height: number, params?: rpcTypes.BlockRequest): Promise<rpcTypes.BlockResponse>;

    abstract blocks(fromHeight: number, toHeight: number, params?: rpcTypes.BlocksRequest): Promise<rpcTypes.BlocksResponse>;

    abstract genesis(): Promise<rpcTypes.GenesisResponse>;

    abstract netInfo(): Promise<rpcTypes.NetInfoResponse>;

    abstract sendTransaction(tx: string, params?: rpcTypes.SendTransactionRequest): Promise<rpcTypes.SendTransactionResponse>;

    abstract status(): Promise<rpcTypes.NodeStatusResponse>;

    abstract transaction(hash: string, params?: rpcTypes.TransactionRequest): Promise<rpcTypes.TransactionResponse>;

    abstract transactions(query: string, params?: rpcTypes.TransactionsRequest): Promise<rpcTypes.TransactionsResponse>;

    abstract unconfirmedTransactions(params: rpcTypes.UnconfirmedTxsRequest): Promise<rpcTypes.UnconfirmedTxsResponse>;

    abstract networkVersion(): Promise<rpcTypes.NetworkVersionResponse>;

    //----------- Account
    abstract address(address: string, params?: rpcTypes.AddressStateRequest): Promise<rpcTypes.AddressStateResponse>;

    abstract addresses(addresses: string[], params?: rpcTypes.AdressesRequest): Promise<rpcTypes.AdressesResponse>;

    abstract frozen(address: string, params?: rpcTypes.AddressFrozenRequest): Promise<rpcTypes.AddressFrozenResponse>;

    abstract waitlist(address: string, params?: rpcTypes.AddressWaitListRequest): Promise<rpcTypes.AddressWaitListResponse>;

    //----------- Validator
    abstract candidate(publicKey: string, params?: rpcTypes.CandidateRequest): Promise<rpcTypes.CandidateResponse>;

    abstract candidates(params?: rpcTypes.CandidatesRequest): Promise<rpcTypes.CandidatesResponse>;

    abstract missedBlocks(publicKey: string, params?: rpcTypes.MissedBlocksRequest): Promise<rpcTypes.MissedBlocksResponse>;

    abstract validators(params?: rpcTypes.ValidatorsRequest): Promise<rpcTypes.ValidatorsResponse>;

    //----------- Coins/Tokens
    abstract coinInfo(symbol: string, params?: rpcTypes.CoinInfoRequest): Promise<rpcTypes.CoinInfoResponse>;

    abstract coinInfoById(id: number, params?: rpcTypes.CoinInfoByIdRequest): Promise<rpcTypes.CoinInfoByIdResponse>;

    abstract estimateCoinBuy(params: rpcTypes.EstimateCoinBuyRequest): Promise<rpcTypes.EstimateCoinBuyResponse>;

    abstract estimateCoinSell(params: rpcTypes.EstimateCoinSellRequest): Promise<rpcTypes.EstimateCoinSellResponse>;

    abstract estimateCoinSellAll(params: rpcTypes.EstimateCoinSellAllRequest): Promise<rpcTypes.EstimateCoinSellAllResponse>;

    //----------- Orders
    abstract limitOrder(params: rpcTypes.LimitOrderRequest): Promise<rpcTypes.LimitOrderResponse>;

    abstract limitOrders(params: rpcTypes.LimitOrdersRequest): Promise<rpcTypes.LimitOrdersResponse>;

    //----------- SwapPools
    abstract swapPool(params: rpcTypes.SwapPoolRequest): Promise<rpcTypes.SwapPoolResponse>;

    //----------- Vote (GOVERNESS) Info
    abstract voteCommission(params: rpcTypes.VoteCommissionRequest): Promise<rpcTypes.VoteCommissionResponse>;

    abstract voteHalt(params: rpcTypes.VoteHaltRequest): Promise<rpcTypes.VoteHaltResponse>;

    abstract voteNetUpdate(params: rpcTypes.VoteNetUpdateRequest): Promise<rpcTypes.VoteNetUpdateResponse>;

    //----------- Prices
    abstract estimateTxCommission(params: rpcTypes.EstimateTxCommissionRequest): Promise<rpcTypes.EstimateTxCommissionResponse>;

    abstract minGasPrice(params: rpcTypes.MinGasPriceRequest): Promise<rpcTypes.MinGasPriceResponse>;

    abstract maxGasPrice(params: rpcTypes.MaxGasPriceRequest): Promise<rpcTypes.MaxGasPriceResponse>;

    abstract priceCommissions(params: rpcTypes.PriceCommissionsRequest): Promise<rpcTypes.PriceCommissionsResponse>;

    //----------- Events
    abstract events(params: rpcTypes.EventsRequest): Promise<rpcTypes.EventsResponse>;

    //
    //-----------  WebSockets
    // abstract  subscribe (SubscribeRequest) returns (stream SubscribeResponse)

}
