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
    block(height: number, params: rpcTypes.BlockRequest): Promise<rpcTypes.BlockResponse>;
    blocks(fromHeight: number, toHeight: number, params: rpcTypes.BlocksRequest): Promise<rpcTypes.BlocksResponse>;
    genesis(): Promise<rpcTypes.GenesisResponse>;
    netInfo(): Promise<rpcTypes.NetInfoResponse>;
    sendTransaction(tx: string, params: rpcTypes.SendTransactionRequest): Promise<rpcTypes.SendTransactionResponse>;
    status(): Promise<rpcTypes.NodeStatusResponse>;
    transaction(hash: string, params: rpcTypes.TransactionRequest): Promise<rpcTypes.TransactionResponse>;
    transactions(query: string, params: rpcTypes.TransactionsRequest): Promise<rpcTypes.TransactionsResponse>;
    unconfirmedTransactions(params: rpcTypes.UnconfirmedTxsRequest): Promise<rpcTypes.UnconfirmedTxsResponse>;
    networkVersion(): Promise<rpcTypes.NetworkVersionResponse>;
    estimateCoinBuy(params: rpcTypes.EstimateCoinBuyRequest): Promise<rpcTypes.EstimateCoinBuyResponse>;
    estimateCoinSell(params: rpcTypes.EstimateCoinSellRequest): Promise<rpcTypes.EstimateCoinSellResponse>;
    estimateCoinSellAll(params: rpcTypes.EstimateCoinSellAllRequest): Promise<rpcTypes.EstimateCoinSellAllResponse>;
    estimateTxCommission(params: rpcTypes.EstimateTxCommissionRequest): Promise<rpcTypes.EstimateTxCommissionResponse>;
    address(address: string, params: rpcTypes.AddressStateRequest): Promise<rpcTypes.AddressStateResponse>;
    addresses(params: rpcTypes.AdressesRequest): Promise<rpcTypes.AdressesResponse>;
    candidate(publicKey: string, params?: rpcTypes.CandidateRequest): Promise<rpcTypes.CandidateResponse>;
    candidates(params?: rpcTypes.CandidatesRequest): Promise<rpcTypes.CandidatesResponse>;
    coinInfo(params: rpcTypes.CoinInfoRequest): Promise<rpcTypes.CoinInfoResponse>;
    coinInfoById(params: rpcTypes.CoinInfoByIdRequest): Promise<rpcTypes.CoinInfoByIdResponse>;
    events(params: rpcTypes.EventsRequest): Promise<rpcTypes.EventsResponse>;
    frozen(params: rpcTypes.AddressFrozenRequest): Promise<rpcTypes.AddressFrozenResponse>;
    limitOrder(params: rpcTypes.LimitOrderRequest): Promise<rpcTypes.LimitOrderResponse>;
    limitOrders(params: rpcTypes.LimitOrdersRequest): Promise<rpcTypes.LimitOrdersResponse>;
    maxGasPrice(params: rpcTypes.MaxGasPriceRequest): Promise<rpcTypes.MaxGasPriceResponse>;
    minGasPrice(params: rpcTypes.MinGasPriceRequest): Promise<rpcTypes.MinGasPriceResponse>;
    missedBlocks(publicKey: string, params?: rpcTypes.MissedBlocksRequest): Promise<rpcTypes.MissedBlocksResponse>;
    priceCommissions(params: rpcTypes.PriceCommissionsRequest): Promise<rpcTypes.PriceCommissionsResponse>;
    swapPool(params: rpcTypes.SwapPoolRequest): Promise<rpcTypes.SwapPoolResponse>;
    validators(params: rpcTypes.ValidatorsRequest): Promise<rpcTypes.ValidatorsResponse>;
    voteCommission(params: rpcTypes.VoteCommissionRequest): Promise<rpcTypes.VoteCommissionResponse>;
    voteHalt(params: rpcTypes.VoteHaltRequest): Promise<rpcTypes.VoteHaltResponse>;
    voteNetUpdate(params: rpcTypes.VoteNetUpdateRequest): Promise<rpcTypes.VoteNetUpdateResponse>;
    waitlist(params: rpcTypes.AddressWaitListRequest): Promise<rpcTypes.AddressWaitListResponse>;
    /** @hidden */
    sendRpcCall<T>(url: string, params?: object, data?: object, method?: string): Promise<T>;
}
