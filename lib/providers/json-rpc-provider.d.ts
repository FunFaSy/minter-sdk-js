/**
 * MINTER JSON HTTP RPC API PROVIDER
 * @module
 */
import { Provider } from './provider';
import * as rpcTypes from './internal';
import HttpTransport, { HttpTransportConfig } from '../transport/http-transport';
/**
 * Client class to interact with the Minter RPC API.
 * @see {@link https://#}
 * @example
 * ```js
 * import * as minterSdk from 'minter-sdk-js';
 *
 * const chain = new minterSdk.Chain(minterSdk.ChainId.TESTNET);
 * const provider = new minterSdk.JsonRpcProvider(chain.urls?.api?.node?.http[0]);
 *
 * ```
 */
export declare class JsonRpcProvider extends Provider {
    /** @hidden */
    protected readonly config: HttpTransportConfig;
    protected readonly transport: HttpTransport;
    /**
     * @param config
     */
    constructor(config: string | HttpTransportConfig);
    block(params: rpcTypes.BlockRequest): Promise<rpcTypes.BlockResponse>;
    blocks(params: rpcTypes.BlocksRequest): Promise<rpcTypes.BlocksResponse>;
    genesis(): Promise<rpcTypes.GenesisResponse>;
    netInfo(): Promise<rpcTypes.NetInfoResponse>;
    sendTransaction(params: rpcTypes.SendTransactionRequest): Promise<rpcTypes.SendTransactionResponse>;
    status(): Promise<rpcTypes.NodeStatusResponse>;
    transaction(params: rpcTypes.TransactionRequest): Promise<rpcTypes.TransactionResponse>;
    transactions(params: rpcTypes.TransactionsRequest): Promise<rpcTypes.TransactionsResponse>;
    unconfirmedTransactions(params: rpcTypes.UnconfirmedTxsRequest): Promise<rpcTypes.UnconfirmedTxsResponse>;
    networkVersion(): Promise<rpcTypes.NetworkVersionResponse>;
    address(params: rpcTypes.AddressStateRequest): Promise<rpcTypes.AddressStateResponse>;
    addresses(params: rpcTypes.AddressesRequest): Promise<rpcTypes.AddressesResponse>;
    frozen(params: rpcTypes.AddressFrozenRequest): Promise<rpcTypes.AddressFrozenResponse>;
    waitlist(params: rpcTypes.AddressWaitListRequest): Promise<rpcTypes.AddressWaitListResponse>;
    candidate(params: rpcTypes.CandidateRequest): Promise<rpcTypes.CandidateResponse>;
    candidates(params?: rpcTypes.CandidatesRequest): Promise<rpcTypes.CandidatesResponse>;
    missedBlocks(params: rpcTypes.MissedBlocksRequest): Promise<rpcTypes.MissedBlocksResponse>;
    validators(params?: rpcTypes.ValidatorsRequest): Promise<rpcTypes.ValidatorsResponse>;
    coinInfo(params: rpcTypes.CoinInfoRequest): Promise<rpcTypes.CoinInfoResponse>;
    coinInfoById(params: rpcTypes.CoinInfoByIdRequest): Promise<rpcTypes.CoinInfoByIdResponse>;
    estimateCoinBuy(params: rpcTypes.EstimateCoinBuyRequest): Promise<rpcTypes.EstimateCoinBuyResponse>;
    estimateCoinSell(params: rpcTypes.EstimateCoinSellRequest): Promise<rpcTypes.EstimateCoinSellResponse>;
    estimateCoinSellAll(params: rpcTypes.EstimateCoinSellAllRequest): Promise<rpcTypes.EstimateCoinSellAllResponse>;
    limitOrder(params: rpcTypes.LimitOrderRequest): Promise<rpcTypes.LimitOrderResponse>;
    limitOrders(params: rpcTypes.LimitOrdersRequest): Promise<rpcTypes.LimitOrdersResponse>;
    swapPool(params: rpcTypes.SwapPoolRequest): Promise<rpcTypes.SwapPoolResponse>;
    estimateTxCommission(params: rpcTypes.EstimateTxCommissionRequest): Promise<rpcTypes.EstimateTxCommissionResponse>;
    minGasPrice(params?: rpcTypes.MinGasPriceRequest): Promise<rpcTypes.MinGasPriceResponse>;
    maxGasPrice(params?: rpcTypes.MaxGasPriceRequest): Promise<rpcTypes.MaxGasPriceResponse>;
    priceCommissions(params: rpcTypes.PriceCommissionsRequest): Promise<rpcTypes.PriceCommissionsResponse>;
    commissionVotes(params: rpcTypes.CommissionVotesRequest): Promise<rpcTypes.CommissionVotesResponse>;
    haltVotes(params: rpcTypes.HaltVotesRequest): Promise<rpcTypes.HaltVotesResponse>;
    netUpdateVotes(params: rpcTypes.NetUpdateVotesRequest): Promise<rpcTypes.NetUpdateVotesResponse>;
    events(params: rpcTypes.EventsRequest): Promise<rpcTypes.EventsResponse>;
    /** @hidden */
    send<T>(url: string, params?: Record<string, unknown>, data?: Record<string, unknown>, method?: string): Promise<T>;
}
