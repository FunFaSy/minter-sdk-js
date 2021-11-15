import {Provider} from './provider';
import {ConnectionInfo, deepExtend, fetchJson, isString, logWarning, TypedError} from '../util';
import exponentialBackoff from '../util/exponential-backoff';
import {parseRpcError} from './errors';
import  * as rpcTypes from './types';

// Default number of retries before giving up on a request.
const REQUEST_RETRY_NUMBER = 5;

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
    readonly connection: ConnectionInfo;

    /**
     * @param connection
     */
    constructor(connection: string | ConnectionInfo) {
        super();
        if (isString(connection)) {
            this.connection = {url: connection.toString()} as ConnectionInfo;
        } else {
            this.connection = connection as ConnectionInfo;
        }
    }

    async sendRpcCall<T>(url: string, data: object = undefined): Promise<T> {
        const resultData = await exponentialBackoff(REQUEST_RETRY_WAIT, REQUEST_RETRY_NUMBER,
            REQUEST_RETRY_WAIT_BACKOFF,
            async () => {
                try {
                    const config = deepExtend({}, this.connection, {url});
                    const response = await fetchJson(config, JSON.stringify(data));

                    if (response?.error) {
                        /**
                         * {
                         *  error: {
                         *   code: "400",
                         *   message: "tx (AC030EE03AD15373EACF98C74A7CBFA614DA7E883C5EFC58E9C366926864E9) not found",
                         *   data: { }
                         *  }
                         * }
                         */
                        if (typeof response.error?.data === 'object') {
                            if (typeof response.error?.message === 'string'
                                && typeof response.error.data?.type === 'string') {
                                // if error data has message and type properties, we consider that node returned an
                                // error in the Typed format
                                throw new TypedError(response.error.message, response.error.data.type);
                            }
                        }

                        throw parseRpcError(response.error);
                    }

                    // Success when response.error is not exist
                    return response;
                }
                catch (error) {
                    if (error?.type === 'TimeoutError') {
                        logWarning(`Retrying request to ${url} as it has timed out`, data);
                        return null;
                    }
                    throw error;
                }
            });

        if (typeof resultData === 'undefined') {
            throw new TypedError(
                `Exceeded ${REQUEST_RETRY_NUMBER} attempts for request to ${url}.`, 'RetriesExceeded');
        }

        return resultData;
    }

    async estimateCoinBuy(params: rpcTypes.EstimateCoinBuyRequest): Promise<rpcTypes.EstimateCoinBuyResult> {
        return Promise.resolve(undefined);
    }

    async estimateCoinSell(params: rpcTypes.EstimateCoinSellRequest): Promise<rpcTypes.EstimateCoinSellResult> {
        return Promise.resolve(undefined);
    }

    async estimateCoinSellAll(params: rpcTypes.EstimateCoinSellAllRequest): Promise<rpcTypes.EstimateCoinSellAllResult> {
        return Promise.resolve(undefined);
    }

    async estimateTxCommission(params: rpcTypes.EstimateTxCommissionRequest): Promise<rpcTypes.EstimateTxCommissionResult> {
        return Promise.resolve(undefined);
    }

    async getAddress(params: rpcTypes.AddressStateRequest): Promise<rpcTypes.AddressStateResult> {
        return Promise.resolve(undefined);
    }

    async getAddresses(params: rpcTypes.AdressesRequest): Promise<rpcTypes.AdressesResult> {
        return Promise.resolve(undefined);
    }

    async getBlock(params: rpcTypes.BlockRequest): Promise<rpcTypes.BlockResult> {
        return Promise.resolve(undefined);
    }

    async getBlocks(params: rpcTypes.BlocksRequest): Promise<rpcTypes.BlocksResult> {
        return Promise.resolve(undefined);
    }

    async getCandidate(params: rpcTypes.CandidateRequest): Promise<rpcTypes.CandidateResult> {
        return Promise.resolve(undefined);
    }

    async getCandidates(params: rpcTypes.CandidatesRequest): Promise<rpcTypes.CandidatesResult> {
        return Promise.resolve(undefined);
    }

    async getCoinInfo(params: rpcTypes.CoinInfoRequest): Promise<rpcTypes.CoinInfoResult> {
        return Promise.resolve(undefined);
    }

    async getCoinInfoById(params: rpcTypes.CoinInfoByIdRequest): Promise<rpcTypes.CoinInfoByIdResult> {
        return Promise.resolve(undefined);
    }

    async getEvents(params: rpcTypes.EventsRequest): Promise<rpcTypes.EventsResult> {
        return Promise.resolve(undefined);
    }

    async getFrozen(params: rpcTypes.AddressFrozenRequest): Promise<rpcTypes.AddressFrozenResult> {
        return Promise.resolve(undefined);
    }

    async getGenesis(): Promise<rpcTypes.GenesisRequest> {
        return Promise.resolve(undefined);
    }

    async getLimitOrder(params: rpcTypes.LimitOrderRequest): Promise<rpcTypes.LimitOrderResult> {
        return Promise.resolve(undefined);
    }

    async getLimitOrders(params: rpcTypes.LimitOrdersRequest): Promise<rpcTypes.LimitOrdersResult> {
        return Promise.resolve(undefined);
    }

    async getMaxGasPrice(params: rpcTypes.MaxGasPriceRequest): Promise<rpcTypes.MaxGasPriceResult> {
        return Promise.resolve(undefined);
    }

    async getMinGasPrice(params: rpcTypes.MinGasPriceRequest): Promise<rpcTypes.MinGasPriceResult> {
        return Promise.resolve(undefined);
    }

    async getMissedBlocks(params: rpcTypes.MissedBlocksRequest): Promise<rpcTypes.MissedBlocksResult> {
        return Promise.resolve(undefined);
    }

    async getNetInfo(): Promise<rpcTypes.NetInfoResult> {
        return Promise.resolve(undefined);
    }

    async getPriceCommissions(params: rpcTypes.PriceCommissionsRequest): Promise<rpcTypes.PriceCommissionsResult> {
        return Promise.resolve(undefined);
    }

    async getStatus(): Promise<rpcTypes.NodeStatusResult> {
        return Promise.resolve(undefined);
    }

    async getSwapPool(params: rpcTypes.SwapPoolRequest): Promise<rpcTypes.SwapPoolResult> {
        return Promise.resolve(undefined);
    }

    async getTransaction(params: rpcTypes.TransactionRequest): Promise<rpcTypes.TransactionResult> {
        return Promise.resolve(undefined);
    }

    async getTransactions(params: rpcTypes.TransactionsRequest): Promise<rpcTypes.TransactionsResult> {
        return Promise.resolve(undefined);
    }

    async getUnconfirmedTransactions(params: rpcTypes.UnconfirmedTxsRequest): Promise<rpcTypes.UnconfirmedTxsResult> {
        return Promise.resolve(undefined);
    }

    async getValidators(params: rpcTypes.ValidatorsRequest): Promise<rpcTypes.ValidatorsResult> {
        return Promise.resolve(undefined);
    }

    async getVersionNetwork(): Promise<rpcTypes.VersionNetworkResult> {
        return Promise.resolve(undefined);
    }

    async getVoteCommission(params: rpcTypes.VoteCommissionRequest): Promise<rpcTypes.VoteCommissionResult> {
        return Promise.resolve(undefined);
    }

    async getVoteHalt(params: rpcTypes.VoteHaltRequest): Promise<rpcTypes.VoteHaltResult> {
        return Promise.resolve(undefined);
    }

    async getVoteNetUpdate(params: rpcTypes.VoteNetUpdateRequest): Promise<rpcTypes.VoteNetUpdateResult> {
        return Promise.resolve(undefined);
    }

    async getWaitlist(params: rpcTypes.AddressWaitListRequest): Promise<rpcTypes.AddressWaitListResult> {
        return Promise.resolve(undefined);
    }

    async query<T extends rpcTypes.QueryResponseKind>(params: rpcTypes.RpcQueryRequest): Promise<T> {
        return Promise.resolve(undefined);
    }

    async sendTransaction(params: rpcTypes.SendTransactionRequest): Promise<rpcTypes.SendTransactionResult> {
        return Promise.resolve(undefined);
    }
}
