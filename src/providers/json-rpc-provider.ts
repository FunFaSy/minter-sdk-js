/**
 * MINTER JSON HTTP RPC API PROVIDER
 * @module
 */
import {Provider} from './provider';
import {
    ConnectionInfo,
    convertBipToPip,
    isInteger,
    isString,
    isValidAddress,
    isValidPublicKey,
    logWarning,
    newRpcClient,
    TypedError,
} from '../util';
import exponentialBackoff from '../util/exponential-backoff';
import {parseRpcError} from './errors';
import * as rpcTypes from './internal';
import {CandidatesStatusEnum} from './internal';
import {AxiosInstance, AxiosRequestConfig} from 'axios';

// Default number of retries before giving up on a request.
const REQUEST_RETRY_NUMBER = 3;

// Default wait until next retry in millis.
const REQUEST_RETRY_WAIT = 500;

// Exponential back off for waiting to retry.
const REQUEST_RETRY_WAIT_BACKOFF = 1.5;

/**
 * Client class to interact with the Minter RPC API.
 * @see {@link https://#}
 */
export class JsonRpcProvider extends Provider {
    /** @hidden */
    protected readonly connection: ConnectionInfo;
    protected readonly rpcClient: AxiosInstance;

    /**
     * @param connection
     */
    constructor(connection: string | ConnectionInfo) {
        super();

        if (isString(connection)) {
            this.connection = {baseURL: connection.toString()} as ConnectionInfo;
        }
        //
        else {
            this.connection = connection as ConnectionInfo;
        }

        this.rpcClient = newRpcClient(this.connection);

    }

    //-----------  Blockchain
    async block(height: number, params?: rpcTypes.BlockRequest): Promise<rpcTypes.BlockResponse> {
        if (!height || isNaN(Number(height))) {
            return Promise.reject(new TypedError('height parameter required', 'ArgumentsRequired'));
        }

        const _params = {
            fields    : params?.fields || [],
            failed_txs: !!params?.failedTxs,
        };
        const url = 'block/'.concat(height.toString());
        return this.sendRpcCall(url, _params);
    }

    async blocks(fromHeight: number, toHeight: number, params?: rpcTypes.BlocksRequest): Promise<rpcTypes.BlocksResponse> {

        if (!fromHeight || !toHeight) {
            return Promise.reject(new TypedError('fromHeight/toHeight  parameters required', 'ArgumentsRequired'));
        }

        const _params = {
            from_height: fromHeight,
            to_height  : toHeight,
            fields     : params?.fields || [],
            failed_txs : !!params?.failedTxs,
        };
        const url = 'blocks';
        return this.sendRpcCall(url, _params);
    }

    async genesis(): Promise<rpcTypes.GenesisResponse> {
        return this.sendRpcCall('genesis');
    }

    async netInfo(): Promise<rpcTypes.NetInfoResponse> {
        return this.sendRpcCall('net_info');
    }

    async sendTransaction(tx: string, params?: rpcTypes.SendTransactionRequest): Promise<rpcTypes.SendTransactionResponse> {
        if (!tx && !params.tx) {
            return Promise.reject(new TypedError('tx parameter not specified', 'ArgumentsRequired'));
        }
        const {_tx, ..._params} = params;

        return this.sendRpcCall('send_transaction', undefined, {tx: tx || _tx, ..._params}, 'post');
    }

    async status(): Promise<rpcTypes.NodeStatusResponse> {
        return this.sendRpcCall('status');
    }

    async transaction(hash: string, params?: rpcTypes.TransactionRequest): Promise<rpcTypes.TransactionResponse> {
        if (!hash && !params.hash) {
            return Promise.reject(new TypedError('transaction hash parameter not specified', 'ArgumentsRequired'));
        }

        const url = 'transaction/'.concat(hash);
        return this.sendRpcCall(url, params);
    }

    async transactions(query: string, params?: rpcTypes.TransactionsRequest): Promise<rpcTypes.TransactionsResponse> {
        if (!query) {
            return Promise.reject(new TypedError('query  parameters required', 'ArgumentsRequired'));
        }

        query = query.replace(/"/g, '\'').replace(/\s/g, '');
        const _params = {
            query,
            page    : params?.page && 0 < params.page ? params.page : 1,
            per_page: params?.perPage && 0 < params.perPage ? params.perPage : 30,
        };
        const url = 'transactions';
        return this.sendRpcCall(url, _params);
    }

    async unconfirmedTransactions(params?: rpcTypes.UnconfirmedTxsRequest): Promise<rpcTypes.UnconfirmedTxsResponse> {
        const _params = {
            limit: params?.limit || 30,
        };
        const url = 'unconfirmed_txs';
        return this.sendRpcCall(url, _params);
    }

    async networkVersion(): Promise<rpcTypes.NetworkVersionResponse> {
        const _params = {};
        const url = 'version_network';
        return this.sendRpcCall(url, _params);
    }

    //----------- Account
    async address(address: string, params?: rpcTypes.AddressStateRequest): Promise<rpcTypes.AddressStateResponse> {
        if (!address || !isValidAddress(address)) {
            return Promise.reject(new TypedError('address parameter not specified or invalid', 'ArgumentsRequired'));
        }

        const _params = {
            height   : params?.height || undefined,
            delegated: !!params?.delegated,
        };
        const url = 'address/'.concat(address);
        return this.sendRpcCall(url, _params);
    }

    async addresses(addresses: string[], params?: rpcTypes.AdressesRequest): Promise<rpcTypes.AdressesResponse> {
        if (!addresses || !addresses.length || addresses.some(a => !isValidAddress(a))) {
            return Promise.reject(
                new TypedError('addresses parameter not specified or some address invalid', 'ArgumentsRequired'));
        }

        const _params = {
            addresses,
            height   : params?.height || undefined,
            delegated: !!params?.delegated,
        };
        const url = 'addresses';
        return this.sendRpcCall(url, _params);
    }

    async frozen(address: string, params?: rpcTypes.AddressFrozenRequest): Promise<rpcTypes.AddressFrozenResponse> {
        if (!address || !isValidAddress(address)) {
            return Promise.reject(new TypedError('address parameter not specified or invalid', 'ArgumentsRequired'));
        }

        const _params = {
            height : params?.height,
            coin_id: params?.coinId,
        };
        const url = `frozen/${address}`;
        return this.sendRpcCall(url, _params);
    }

    async waitlist(address: string, params?: rpcTypes.AddressWaitListRequest): Promise<rpcTypes.AddressWaitListResponse> {
        if (!address || !isValidAddress(address)) {
            return Promise.reject(new TypedError('address parameter not specified or invalid', 'ArgumentsRequired'));
        }
        const _params = {
            height    : params?.height,
            public_key: params?.publicKey,
        };
        const url = `waitlist/${address}`;
        return this.sendRpcCall(url, _params);
    }

    //----------- Validator
    async candidate(publicKey: string, params?: rpcTypes.CandidateRequest): Promise<rpcTypes.CandidateResponse> {
        if (!publicKey || !isValidPublicKey(publicKey)) {
            return Promise.reject(new TypedError('publicKey parameter not specified or invalid', 'ArgumentsRequired'));
        }

        const _params = {
            height         : params?.height,
            not_show_stakes: !params?.showStakes,
        };
        const url = 'candidate/'.concat(publicKey);
        return this.sendRpcCall(url, _params);
    }

    async candidates(params?: rpcTypes.CandidatesRequest): Promise<rpcTypes.CandidatesResponse> {
        const _params = {
            height         : params?.height,
            include_stakes : params?.includeStakes || false,
            not_show_stakes: !params?.showStakes,
            status         : params?.status || CandidatesStatusEnum.ALL,
        };
        const url = 'candidates';

        return this.sendRpcCall(url, _params);
    }

    async missedBlocks(publicKey: string, params?: rpcTypes.MissedBlocksRequest): Promise<rpcTypes.MissedBlocksResponse> {
        if (!publicKey || !isValidPublicKey(publicKey)) {
            return Promise.reject(new TypedError('publicKey parameter not specified or invalid', 'ArgumentsRequired'));
        }
        const _params = {
            height: params?.height,
        };
        const url = 'missed_blocks/'.concat(publicKey);
        return this.sendRpcCall(url, _params);
    }

    async validators(params?: rpcTypes.ValidatorsRequest): Promise<rpcTypes.ValidatorsResponse> {
        const _params = {
            height: params?.height,
        };
        const url = 'validators';
        return this.sendRpcCall(url, _params);
    }

    //----------- Coins/Tokens
    async coinInfo(symbol: string, params?: rpcTypes.CoinInfoRequest): Promise<rpcTypes.CoinInfoResponse> {
        const url = 'coin_info/'.concat(symbol.toUpperCase());
        const _params = {
            height: params?.height,
        };

        return this.sendRpcCall(url, _params);
    }

    async coinInfoById(id: number, params?: rpcTypes.CoinInfoByIdRequest): Promise<rpcTypes.CoinInfoByIdResponse> {
        if (!isInteger(Number(id)) || 0 > id) {
            return Promise.reject(new TypedError('id parameter not specified or invalid', 'ArgumentsRequired'));
        }

        const url = 'coin_info_by_id/'.concat(id.toString());
        const _params = {
            height: params?.height,
        };

        return this.sendRpcCall(url, _params);
    }

    async estimateCoinBuy(params: rpcTypes.EstimateCoinBuyRequest): Promise<rpcTypes.EstimateCoinBuyResponse> {
        if (!params.coinToSell && 0 > params.coinIdToSell) {
            return Promise.reject(new TypedError('coinIdToSell not specified', 'ArgumentsRequired'));
        }
        if (!params.coinToBuy && 0 > params.coinIdToBuy) {
            return Promise.reject(new TypedError('coinIdToBuy not specified', 'ArgumentsRequired'));
        }
        if (!params.valueToBuy) {
            return Promise.reject(new TypedError('valueToBuy not specified', 'ArgumentsRequired'));
        }

        if (params?.coinToBuy) {
            params.coinToBuy = params.coinToBuy.toUpperCase();
        }
        if (params?.coinToSell) {
            params.coinToSell = params.coinToSell.toUpperCase();
        }
        if (params?.coinCommission) {
            params.coinCommission = params.coinCommission.toUpperCase();
        }

        if (typeof params.valueToBuy == 'number') {
            params.valueToBuy = convertBipToPip(params.valueToBuy);
        }

        const {
            coinIdToBuy     : coin_id_to_buy,
            coinToBuy       : coin_to_buy,
            coinIdToSell    : coin_id_to_sell,
            coinToSell      : coin_to_sell,
            valueToBuy      : value_to_buy,
            coinIdCommission: coin_id_commission,
            coinCommission  : coin_commission,
            swapFrom        : swap_from,
            route           : route,
        } = params;

        const url = 'estimate_coin_buy';
        return this.sendRpcCall(url, {
            coin_id_to_buy,
            coin_to_buy,
            coin_id_to_sell,
            coin_to_sell,
            value_to_buy,
            coin_id_commission,
            coin_commission,
            swap_from,
            route,
        });
    }

    async estimateCoinSell(params: rpcTypes.EstimateCoinSellRequest): Promise<rpcTypes.EstimateCoinSellResponse> {

        if (!isInteger(Number(params.coinIdToSell)) || 0 > params.coinIdToSell) {
            return Promise.reject(new TypedError('coinIdToSell not specified', 'ArgumentsRequired'));
        }
        if (!isInteger(Number(params.coinIdToBuy)) || 0 > params.coinIdToBuy) {
            return Promise.reject(new TypedError('coinIdToBuy not specified', 'ArgumentsRequired'));
        }
        if (!params?.valueToSell) {
            return Promise.reject(new TypedError('valueToSell not specified', 'ArgumentsRequired'));
        }

        if (params?.coinToBuy) {
            params.coinToBuy = params.coinToBuy.toUpperCase();
        }
        if (params?.coinToSell) {
            params.coinToSell = params.coinToSell.toUpperCase();
        }
        if (params?.coinCommission) {
            params.coinCommission = params.coinCommission.toUpperCase();
        }

        // Assume number meaning BIP units, string is PIP units
        if (typeof params.valueToSell == 'number') {
            params.valueToSell = convertBipToPip(params.valueToSell);
        }

        const {
            coinIdToBuy     : coin_id_to_buy,
            coinToBuy       : coin_to_buy,
            coinIdToSell    : coin_id_to_sell,
            coinToSell      : coin_to_sell,
            valueToSell     : value_to_sell,
            coinIdCommission: coin_id_commission,
            coinCommission  : coin_commission,
            swapFrom        : swap_from,
            route           : route,
        } = params;
        const url = 'estimate_coin_sell';

        return this.sendRpcCall(url, {
            coin_id_to_buy,
            coin_to_buy,
            coin_id_to_sell,
            coin_to_sell,
            value_to_sell,
            coin_id_commission,
            coin_commission,
            swap_from,
            route,
        });
    }

    async estimateCoinSellAll(params: rpcTypes.EstimateCoinSellAllRequest): Promise<rpcTypes.EstimateCoinSellAllResponse> {
        if (!params.coinToSell && 0 > params.coinIdToSell) {
            return Promise.reject(new TypedError('coinIdToSell not specified', 'ArgumentsRequired'));
        }
        if (!params.coinToBuy && 0 > params.coinIdToBuy) {
            return Promise.reject(new TypedError('coinIdToBuy not specified', 'ArgumentsRequired'));
        }
        if (!params.valueToSell) {
            return Promise.reject(new TypedError('VvalueToSell not specified', 'ArgumentsRequired'));
        }

        if (params.coinToBuy) {
            params.coinToBuy = params.coinToBuy.toUpperCase();
        }
        if (params.coinToSell) {
            params.coinToSell = params.coinToSell.toUpperCase();
        }

        if (typeof params.valueToSell == 'number') {
            params.valueToSell = convertBipToPip(params.valueToSell);
        }

        const {
            coinIdToBuy : coin_id_to_buy,
            coinToBuy   : coin_to_buy,
            coinIdToSell: coin_id_to_sell,
            coinToSell  : coin_to_sell,
            valueToSell : value_to_sell,
            gasPrice    : gas_price,
            swapFrom    : swap_from,
            route       : route,
        } = params;

        const url = 'estimate_coin_sell_all';

        return this.sendRpcCall(url, {
            coin_id_to_buy,
            coin_to_buy,
            coin_id_to_sell,
            coin_to_sell,
            value_to_sell,
            gas_price,
            swap_from,
            route,
        });
    }

    //----------- Orders
    async limitOrder(orderId: number, params?: rpcTypes.LimitOrderRequest): Promise<rpcTypes.LimitOrderResponse> {
        if (!isInteger(Number(orderId)) || 0 > orderId) {
            return Promise.reject(new TypedError('orderId parameter not specified', 'ArgumentsRequired'));
        }

        const _params = {
            height: params?.height,
        };
        const url = 'limit_order/'.concat(orderId.toString());

        return this.sendRpcCall(url, _params);
    }

    async limitOrders(ids: number[], params?: rpcTypes.LimitOrdersRequest): Promise<rpcTypes.LimitOrdersResponse> {

        if (!ids || !ids?.length || ids.some(id => (!isInteger(Number(id)) || 0 > id))) {
            return Promise.reject(
                new TypedError('ids parameter not specified or some id invalid', 'ArgumentsRequired'));
        }

        const _params = {
            ids,
            height: params?.height,
        };
        const url = 'limit_orders';

        return this.sendRpcCall(url, _params);
    }

    //----------- SwapPools
    async swapPool(params: rpcTypes.SwapPoolRequest): Promise<rpcTypes.SwapPoolResponse> {
        if (!isInteger(Number(params.coin0)) || 0 > params.coin0) {
            return Promise.reject(new TypedError('coin0 parameter not specified', 'ArgumentsRequired'));
        }
        if (!isInteger(Number(params.coin1)) || 0 > params.coin1) {
            return Promise.reject(new TypedError('coin1 parameter not specified', 'ArgumentsRequired'));
        }
        if (params?.provider && !isValidAddress(params.provider)) {
            return Promise.reject(
                new TypedError('provider parameter invalid', 'ArgumentsRequired'));
        }

        const _params = {
            height: params?.height,
        };

        let url = `swap_pool/${params.coin0.toString()}/${params.coin1.toString()}`;

        if (params?.provider) {
            url = url.concat(`/${params.provider.toString()}`);
        }

        return this.sendRpcCall(url, _params);
    }

    //----------- Prices

    async estimateTxCommission(params: rpcTypes.EstimateTxCommissionRequest): Promise<rpcTypes.EstimateTxCommissionResponse> {
        return Promise.resolve(undefined);
    }

    async minGasPrice(params: rpcTypes.MinGasPriceRequest): Promise<rpcTypes.MinGasPriceResponse> {
        return Promise.resolve(undefined);
    }

    async maxGasPrice(params: rpcTypes.MaxGasPriceRequest): Promise<rpcTypes.MaxGasPriceResponse> {
        return Promise.resolve(undefined);
    }

    async priceCommissions(params: rpcTypes.PriceCommissionsRequest): Promise<rpcTypes.PriceCommissionsResponse> {
        return Promise.resolve(undefined);
    }

    //----------- Vote (GOVERNESS) Info

    async voteCommission(params: rpcTypes.VoteCommissionRequest): Promise<rpcTypes.VoteCommissionResponse> {
        return Promise.resolve(undefined);
    }

    async voteHalt(params: rpcTypes.VoteHaltRequest): Promise<rpcTypes.VoteHaltResponse> {
        return Promise.resolve(undefined);
    }

    async voteNetUpdate(params: rpcTypes.VoteNetUpdateRequest): Promise<rpcTypes.VoteNetUpdateResponse> {
        return Promise.resolve(undefined);
    }

    //----------- Events
    async events(params: rpcTypes.EventsRequest): Promise<rpcTypes.EventsResponse> {
        return Promise.resolve(undefined);
    }

    /** @hidden */
    async sendRpcCall<T>(url: string, params: object = undefined, data: object = undefined, method = 'get'): Promise<T> {
        return exponentialBackoff(REQUEST_RETRY_WAIT, REQUEST_RETRY_NUMBER, REQUEST_RETRY_WAIT_BACKOFF,
            async () => {

                return await this.rpcClient({method, url, params, data} as AxiosRequestConfig)
                    //
                    .then((response) => {
                        const {data} = response;

                        if (data?.error) {
                            if (typeof data.error?.data === 'object') {
                                if (typeof data.error?.message === 'string'
                                    && typeof data.error.data?.type === 'string') {
                                    // if error data has message and type properties, we consider that node returned an
                                    // error in the Typed format
                                    throw new TypedError(data.error.message, data.error.data.type);
                                }
                            }

                            throw parseRpcError(data.error);
                        }

                        return data;
                    })
                    //
                    .catch((error) => {
                        if (error?.type === 'TimeoutError') {
                            logWarning(`Retrying request to ${url} as it has timed out`, params);
                            return null;
                        }
                        throw error;
                    });
            });
    }

}
