"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonRpcProvider = void 0;
/**
 * MINTER JSON HTTP RPC API PROVIDER
 * @module
 */
const provider_1 = require("./provider");
const util_1 = require("../util");
const exponential_backoff_1 = __importDefault(require("../util/exponential-backoff"));
const errors_1 = require("./errors");
const internal_1 = require("./internal");
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
class JsonRpcProvider extends provider_1.Provider {
    /**
     * @param connection
     */
    constructor(connection) {
        super();
        if (util_1.isString(connection)) {
            this.connection = { url: connection.toString() };
        }
        else {
            this.connection = connection;
        }
        this.rpcClient = util_1.newRpcClient(this.connection);
    }
    //-----------  Blockchain
    async block(height, params) {
        if (!height) {
            return Promise.reject(new util_1.TypedError('height parameter required', 'ArgumentsRequired'));
        }
        const _params = {
            fields: params?.fields || [],
            failed_txs: !!params?.failedTxs,
        };
        const url = 'block/'.concat(height.toString());
        return this.sendRpcCall(url, _params);
    }
    async blocks(fromHeight, toHeight, params) {
        if (!fromHeight || !toHeight) {
            return Promise.reject(new util_1.TypedError('fromHeight/toHeight  parameters required', 'ArgumentsRequired'));
        }
        const _params = {
            from_height: fromHeight,
            to_height: toHeight,
            fields: params?.fields || [],
            failed_txs: !!params?.failedTxs,
        };
        const url = 'blocks';
        return this.sendRpcCall(url, _params);
    }
    async genesis() {
        return this.sendRpcCall('genesis');
    }
    async netInfo() {
        return this.sendRpcCall('net_info');
    }
    async sendTransaction(tx, params) {
        if (!tx && !params.tx) {
            return Promise.reject(new util_1.TypedError('tx parameter not specified', 'ArgumentsRequired'));
        }
        const { _tx, ..._params } = params;
        return this.sendRpcCall('send_transaction', undefined, { tx: tx || _tx, ..._params }, 'post');
    }
    async status() {
        return this.sendRpcCall('status');
    }
    async transaction(hash, params) {
        if (!hash && !params.hash) {
            return Promise.reject(new util_1.TypedError('transaction hash parameter not specified', 'ArgumentsRequired'));
        }
        const url = 'transaction/'.concat(hash);
        return this.sendRpcCall(url, params);
    }
    async transactions(query, params) {
        if (!query) {
            return Promise.reject(new util_1.TypedError('query  parameters required', 'ArgumentsRequired'));
        }
        query = query.replace(/"/g, '\'').replace(/\s/g, '');
        const _params = {
            query,
            page: params?.page && 0 < params.page ? params.page : 1,
            per_page: params?.perPage && 0 < params.perPage ? params.perPage : 30,
        };
        const url = 'transactions';
        return this.sendRpcCall(url, _params);
    }
    async unconfirmedTransactions(params) {
        const _params = {
            limit: params?.limit || 30,
        };
        const url = 'unconfirmed_txs';
        return this.sendRpcCall(url, _params);
    }
    async networkVersion() {
        const _params = {};
        const url = 'version_network';
        return this.sendRpcCall(url, _params);
    }
    //----------- Account
    async estimateCoinBuy(params) {
        return Promise.resolve(undefined);
    }
    async estimateCoinSell(params) {
        return Promise.resolve(undefined);
    }
    async estimateCoinSellAll(params) {
        return Promise.resolve(undefined);
    }
    async estimateTxCommission(params) {
        return Promise.resolve(undefined);
    }
    async address(address, params) {
        return this.sendRpcCall(`block/${address}`, params);
    }
    async addresses(params) {
        return Promise.resolve(undefined);
    }
    async candidate(publicKey, params = { height: undefined, showStakes: true }) {
        const _params = {
            height: params.height,
            not_show_stakes: !params.showStakes,
        };
        const url = 'candidate/'.concat(publicKey);
        return this.sendRpcCall(url, _params);
    }
    async candidates(params = {
        height: undefined,
        includeStakes: false,
        showStakes: true,
        status: internal_1.CandidatesStatusEnum.ALL,
    }) {
        const _params = {
            height: params.height,
            include_stakes: params.includeStakes,
            not_show_stakes: !params.showStakes,
            status: params.status,
        };
        const url = 'candidates';
        return this.sendRpcCall(url, _params);
    }
    async coinInfo(params) {
        return Promise.resolve(undefined);
    }
    async coinInfoById(params) {
        return Promise.resolve(undefined);
    }
    async events(params) {
        return Promise.resolve(undefined);
    }
    async frozen(params) {
        return Promise.resolve(undefined);
    }
    async limitOrder(params) {
        return Promise.resolve(undefined);
    }
    async limitOrders(params) {
        return Promise.resolve(undefined);
    }
    async maxGasPrice(params) {
        return Promise.resolve(undefined);
    }
    async minGasPrice(params) {
        return Promise.resolve(undefined);
    }
    async missedBlocks(publicKey, params = { height: undefined }) {
        const url = 'missed_blocks/'.concat(publicKey);
        return this.sendRpcCall(url, params);
    }
    async priceCommissions(params) {
        return Promise.resolve(undefined);
    }
    async swapPool(params) {
        return Promise.resolve(undefined);
    }
    async validators(params) {
        return Promise.resolve(undefined);
    }
    async voteCommission(params) {
        return Promise.resolve(undefined);
    }
    async voteHalt(params) {
        return Promise.resolve(undefined);
    }
    async voteNetUpdate(params) {
        return Promise.resolve(undefined);
    }
    async waitlist(params) {
        return Promise.resolve(undefined);
    }
    /** @hidden */
    async sendRpcCall(url, params = undefined, data = undefined, method = 'get') {
        return exponential_backoff_1.default(REQUEST_RETRY_WAIT, REQUEST_RETRY_NUMBER, REQUEST_RETRY_WAIT_BACKOFF, async () => {
            return await this.rpcClient({ method, url, params, data })
                //
                .then((response) => {
                const { data } = response;
                if (data?.error) {
                    if (typeof data.error?.data === 'object') {
                        if (typeof data.error?.message === 'string'
                            && typeof data.error.data?.type === 'string') {
                            // if error data has message and type properties, we consider that node returned an
                            // error in the Typed format
                            throw new util_1.TypedError(data.error.message, data.error.data.type);
                        }
                    }
                    throw errors_1.parseRpcError(data.error);
                }
                return data;
            })
                //
                .catch((error) => {
                if (error?.type === 'TimeoutError') {
                    util_1.logWarning(`Retrying request to ${url} as it has timed out`, params);
                    return null;
                }
                throw error;
            });
        });
    }
}
exports.JsonRpcProvider = JsonRpcProvider;
