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
        //
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
    async address(address, params) {
        if (!address) {
            return Promise.reject(new util_1.TypedError('address parameter not specified', 'ArgumentsRequired'));
        }
        const _params = {
            height: params?.height || undefined,
            delegated: !!params?.delegated,
        };
        const url = 'address/'.concat(address);
        return this.sendRpcCall(url, _params);
    }
    async addresses(addresses, params) {
        if (!addresses || !addresses.length) {
            return Promise.reject(new util_1.TypedError('addresses parameter not specified or empty array', 'ArgumentsRequired'));
        }
        const _params = {
            addresses,
            height: params?.height || undefined,
            delegated: !!params?.delegated,
        };
        const url = 'addresses';
        return this.sendRpcCall(url, _params);
    }
    async frozen(address, params) {
        if (!address) {
            return Promise.reject(new util_1.TypedError('address parameter not specified', 'ArgumentsRequired'));
        }
        const _params = {
            height: params?.height,
            coin_id: params?.coinId,
        };
        const url = `frozen/${address}`;
        return this.sendRpcCall(url, _params);
    }
    async waitlist(address, params) {
        if (!address) {
            return Promise.reject(new util_1.TypedError('address parameter not specified', 'ArgumentsRequired'));
        }
        const _params = {
            height: params?.height,
            public_key: params?.publicKey,
        };
        const url = `waitlist/${address}`;
        return this.sendRpcCall(url, _params);
    }
    //----------- Validator
    async candidate(publicKey, params) {
        if (!publicKey) {
            return Promise.reject(new util_1.TypedError('publicKey parameter not specified', 'ArgumentsRequired'));
        }
        const _params = {
            height: params?.height,
            not_show_stakes: !params?.showStakes,
        };
        const url = 'candidate/'.concat(publicKey);
        return this.sendRpcCall(url, _params);
    }
    async candidates(params) {
        const _params = {
            height: params?.height,
            include_stakes: params?.includeStakes || false,
            not_show_stakes: !params?.showStakes,
            status: params?.status || internal_1.CandidatesStatusEnum.ALL,
        };
        const url = 'candidates';
        return this.sendRpcCall(url, _params);
    }
    async missedBlocks(publicKey, params) {
        if (!publicKey) {
            return Promise.reject(new util_1.TypedError('publicKey parameter not specified', 'ArgumentsRequired'));
        }
        const _params = {
            height: params?.height,
        };
        const url = 'missed_blocks/'.concat(publicKey);
        return this.sendRpcCall(url, _params);
    }
    async validators(params) {
        const _params = {
            height: params?.height,
        };
        const url = 'validators';
        return this.sendRpcCall(url, _params);
    }
    //----------- Coins/Tokens
    async coinInfo(symbol, params) {
        const url = 'coin_info/'.concat(symbol.toUpperCase());
        const _params = {
            height: params?.height,
        };
        return this.sendRpcCall(url, _params);
    }
    async coinInfoById(id, params) {
        const url = 'coin_info_by_id/'.concat(id.toString());
        const _params = {
            height: params?.height,
        };
        return this.sendRpcCall(url, _params);
    }
    async estimateCoinBuy(params) {
        if (!params.coinToSell && 0 > params.coinIdToSell) {
            return Promise.reject(new Error('Coin to sell not specified'));
        }
        if (!params.coinToBuy && 0 > params.coinIdToBuy) {
            return Promise.reject(new Error('Coin to buy not specified'));
        }
        if (!params.valueToBuy) {
            return Promise.reject(new Error('Value to buy not specified'));
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
            params.valueToBuy = util_1.convertBipToPip(params.valueToBuy);
        }
        const { coinIdToBuy: coin_id_to_buy, coinToBuy: coin_to_buy, coinIdToSell: coin_id_to_sell, coinToSell: coin_to_sell, valueToBuy: value_to_buy, coinIdCommission: coin_id_commission, coinCommission: coin_commission, swapFrom: swap_from, route: route, } = params;
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
    async estimateCoinSell(params) {
        if (!params.coinToSell && 0 > params.coinIdToSell) {
            return Promise.reject(new Error('Coin to sell not specified'));
        }
        if (!params.coinToBuy && 0 > params.coinIdToBuy) {
            return Promise.reject(new Error('Coin to buy not specified'));
        }
        if (!params.valueToSell) {
            return Promise.reject(new Error('Value to sell not specified'));
        }
        if (params.coinToBuy) {
            params.coinToBuy = params.coinToBuy.toUpperCase();
        }
        if (params.coinToSell) {
            params.coinToSell = params.coinToSell.toUpperCase();
        }
        if (params.coinCommission) {
            params.coinCommission = params.coinCommission.toUpperCase();
        }
        if (typeof params.valueToSell == 'number') {
            params.valueToSell = util_1.convertBipToPip(params.valueToSell);
        }
        const { coinIdToBuy: coin_id_to_buy, coinToBuy: coin_to_buy, coinIdToSell: coin_id_to_sell, coinToSell: coin_to_sell, valueToSell: value_to_sell, coinIdCommission: coin_id_commission, coinCommission: coin_commission, swapFrom: swap_from, route: route, } = params;
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
    async estimateCoinSellAll(params) {
        if (!params.coinToSell && 0 > params.coinIdToSell) {
            return Promise.reject(new Error('Coin to sell not specified'));
        }
        if (!params.coinToBuy && 0 > params.coinIdToBuy) {
            return Promise.reject(new Error('Coin to buy not specified'));
        }
        if (!params.valueToSell) {
            return Promise.reject(new Error('Value to sell not specified'));
        }
        if (params.coinToBuy) {
            params.coinToBuy = params.coinToBuy.toUpperCase();
        }
        if (params.coinToSell) {
            params.coinToSell = params.coinToSell.toUpperCase();
        }
        if (typeof params.valueToSell == 'number') {
            params.valueToSell = util_1.convertBipToPip(params.valueToSell);
        }
        const { coinIdToBuy: coin_id_to_buy, coinToBuy: coin_to_buy, coinIdToSell: coin_id_to_sell, coinToSell: coin_to_sell, valueToSell: value_to_sell, gasPrice: gas_price, swapFrom: swap_from, route: route, } = params;
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
    //----------- SwapPools
    //----------- Vote (GOVERNESS) Info
    //----------- Prices
    async estimateTxCommission(params) {
        return Promise.resolve(undefined);
    }
    async events(params) {
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
    async priceCommissions(params) {
        return Promise.resolve(undefined);
    }
    async swapPool(params) {
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
