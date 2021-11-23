/**
 * MINTER JSON HTTP RPC API PROVIDER
 * @module
 */
import { Provider } from './provider';
import { ConnectionInfo } from '../util';
import * as rpcTypes from './internal';
import { AxiosInstance } from 'axios';
/**
 * Client class to interact with the Minter RPC API.
 * @see {@link https://#}
 */
export declare class JsonRpcProvider extends Provider {
    /** @hidden */
    protected readonly connection: ConnectionInfo;
    protected readonly rpcClient: AxiosInstance;
    /**
     * @param connection
     */
    constructor(connection: string | ConnectionInfo);
    block(height: number, params?: rpcTypes.BlockRequest): Promise<rpcTypes.BlockResponse>;
    blocks(fromHeight: number, toHeight: number, params?: rpcTypes.BlocksRequest): Promise<rpcTypes.BlocksResponse>;
    genesis(): Promise<rpcTypes.GenesisResponse>;
    netInfo(): Promise<rpcTypes.NetInfoResponse>;
    sendTransaction(tx: string, params?: rpcTypes.SendTransactionRequest): Promise<rpcTypes.SendTransactionResponse>;
    status(): Promise<rpcTypes.NodeStatusResponse>;
    transaction(hash: string, params?: rpcTypes.TransactionRequest): Promise<rpcTypes.TransactionResponse>;
    transactions(query: string, params?: rpcTypes.TransactionsRequest): Promise<rpcTypes.TransactionsResponse>;
    unconfirmedTransactions(params?: rpcTypes.UnconfirmedTxsRequest): Promise<rpcTypes.UnconfirmedTxsResponse>;
    networkVersion(): Promise<rpcTypes.NetworkVersionResponse>;
    address(address: string, params?: rpcTypes.AddressStateRequest): Promise<rpcTypes.AddressStateResponse>;
    addresses(addresses: string[], params?: rpcTypes.AdressesRequest): Promise<rpcTypes.AdressesResponse>;
    frozen(address: string, params?: rpcTypes.AddressFrozenRequest): Promise<rpcTypes.AddressFrozenResponse>;
    waitlist(address: string, params?: rpcTypes.AddressWaitListRequest): Promise<rpcTypes.AddressWaitListResponse>;
    candidate(publicKey: string, params?: rpcTypes.CandidateRequest): Promise<rpcTypes.CandidateResponse>;
    candidates(params?: rpcTypes.CandidatesRequest): Promise<rpcTypes.CandidatesResponse>;
    missedBlocks(publicKey: string, params?: rpcTypes.MissedBlocksRequest): Promise<rpcTypes.MissedBlocksResponse>;
    validators(params?: rpcTypes.ValidatorsRequest): Promise<rpcTypes.ValidatorsResponse>;
    coinInfo(symbol: string, params?: rpcTypes.CoinInfoRequest): Promise<rpcTypes.CoinInfoResponse>;
    coinInfoById(id: number, params?: rpcTypes.CoinInfoByIdRequest): Promise<rpcTypes.CoinInfoByIdResponse>;
    estimateCoinBuy(params: rpcTypes.EstimateCoinBuyRequest): Promise<rpcTypes.EstimateCoinBuyResponse>;
    estimateCoinSell(params: rpcTypes.EstimateCoinSellRequest): Promise<rpcTypes.EstimateCoinSellResponse>;
    estimateCoinSellAll(params: rpcTypes.EstimateCoinSellAllRequest): Promise<rpcTypes.EstimateCoinSellAllResponse>;
    limitOrder(orderId: number, params?: rpcTypes.LimitOrderRequest): Promise<rpcTypes.LimitOrderResponse>;
    limitOrders(ids: number[], params?: rpcTypes.LimitOrdersRequest): Promise<rpcTypes.LimitOrdersResponse>;
    swapPool(params: rpcTypes.SwapPoolRequest): Promise<rpcTypes.SwapPoolResponse>;
    estimateTxCommission(params: rpcTypes.EstimateTxCommissionRequest): Promise<rpcTypes.EstimateTxCommissionResponse>;
    events(params: rpcTypes.EventsRequest): Promise<rpcTypes.EventsResponse>;
    maxGasPrice(params: rpcTypes.MaxGasPriceRequest): Promise<rpcTypes.MaxGasPriceResponse>;
    minGasPrice(params: rpcTypes.MinGasPriceRequest): Promise<rpcTypes.MinGasPriceResponse>;
    priceCommissions(params: rpcTypes.PriceCommissionsRequest): Promise<rpcTypes.PriceCommissionsResponse>;
    voteCommission(params: rpcTypes.VoteCommissionRequest): Promise<rpcTypes.VoteCommissionResponse>;
    voteHalt(params: rpcTypes.VoteHaltRequest): Promise<rpcTypes.VoteHaltResponse>;
    voteNetUpdate(params: rpcTypes.VoteNetUpdateRequest): Promise<rpcTypes.VoteNetUpdateResponse>;
    /** @hidden */
    sendRpcCall<T>(url: string, params?: object, data?: object, method?: string): Promise<T>;
}
