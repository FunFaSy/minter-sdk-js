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
const http_transport_1 = __importDefault(require("../transport/http-transport"));
const json_serializer_1 = __importDefault(require("../transport/json-serializer"));
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
class JsonRpcProvider extends provider_1.Provider {
    /**
     * @param config
     */
    constructor(config) {
        super();
        if (util_1.isString(config)) {
            this.config = { baseURL: config.toString() };
        }
        //
        else {
            this.config = config;
        }
        this.transport = new http_transport_1.default(this.config, new json_serializer_1.default());
    }
    //-----------  Blockchain
    async block(params) {
        if (!params.height || isNaN(Number(params.height))) {
            return Promise.reject(new util_1.TypedError('height parameter required', 'ArgumentsRequired'));
        }
        const _params = {
            fields: params?.fields || [],
            failed_txs: !!params?.failedTxs,
        };
        const url = 'block/'.concat(params.height.toString());
        return this.send(url, _params);
    }
    async blocks(params) {
        if (!params.fromHeight || !params.toHeight) {
            return Promise.reject(new util_1.TypedError('fromHeight/toHeight  parameters required', 'ArgumentsRequired'));
        }
        const _params = {
            from_height: params.fromHeight,
            to_height: params.toHeight,
            fields: params?.fields || [],
            failed_txs: !!params?.failedTxs,
        };
        const url = 'blocks';
        return this.send(url, _params);
    }
    async genesis() {
        return this.send('genesis');
    }
    async netInfo() {
        return this.send('net_info');
    }
    async sendTransaction(params) {
        if ((!params.tx)) {
            return Promise.reject(new util_1.TypedError('tx parameter not specified', 'ArgumentsRequired'));
        }
        return this.send('send_transaction', undefined, params, 'post');
    }
    async status() {
        return this.send('status');
    }
    async transaction(params) {
        if (!params.hash) {
            return Promise.reject(new util_1.TypedError('hash parameter not specified', 'ArgumentsRequired'));
        }
        const url = 'transaction/'.concat(params.hash);
        return this.send(url, params);
    }
    async transactions(params) {
        if (!params.query) {
            return Promise.reject(new util_1.TypedError('query  parameters required', 'ArgumentsRequired'));
        }
        const query = params.query.replace(/"/g, '\'').replace(/\s/g, '');
        const _params = {
            query,
            page: params?.page && 0 < params.page ? params.page : 1,
            per_page: params?.perPage && 0 < params.perPage ? params.perPage : 30,
        };
        const url = 'transactions';
        return this.send(url, _params);
    }
    async unconfirmedTransactions(params) {
        const _params = {
            limit: params?.limit || 30,
        };
        const url = 'unconfirmed_txs';
        return this.send(url, _params);
    }
    async networkVersion() {
        const _params = {};
        const url = 'version_network';
        return this.send(url, _params);
    }
    //----------- Account
    async address(params) {
        if (!params.address || !util_1.isValidAddress(params.address)) {
            return Promise.reject(new util_1.TypedError('address parameter not specified or invalid', 'ArgumentsRequired'));
        }
        const _params = {
            height: params?.height || undefined,
            delegated: !!params?.delegated,
        };
        const url = 'address/'.concat(params.address);
        return this.send(url, _params);
    }
    async addresses(params) {
        if (!params.addresses || !params.addresses.length || params.addresses.some(a => !util_1.isValidAddress(a))) {
            return Promise.reject(new util_1.TypedError('addresses parameter not specified or some address invalid', 'ArgumentsRequired'));
        }
        const _params = {
            addresses: params.addresses,
            height: params?.height || undefined,
            delegated: !!params?.delegated,
        };
        const url = 'addresses';
        return this.send(url, _params);
    }
    async frozen(params) {
        if (!params.address || !util_1.isValidAddress(params.address)) {
            return Promise.reject(new util_1.TypedError('address parameter not specified or invalid', 'ArgumentsRequired'));
        }
        const _params = {
            height: params?.height,
            coin_id: params?.coinId,
        };
        const url = `frozen/${params.address}`;
        return this.send(url, _params);
    }
    async waitlist(params) {
        if (!params.address || !util_1.isValidAddress(params.address)) {
            return Promise.reject(new util_1.TypedError('address parameter not specified or invalid', 'ArgumentsRequired'));
        }
        const _params = {
            height: params?.height,
            public_key: params?.publicKey,
        };
        const url = `waitlist/${params.address}`;
        return this.send(url, _params);
    }
    //----------- Validator
    async candidate(params) {
        if (!params.publicKey || !util_1.isValidPublicKey(params.publicKey)) {
            return Promise.reject(new util_1.TypedError('publicKey parameter not specified or invalid', 'ArgumentsRequired'));
        }
        const _params = {
            height: params?.height,
            not_show_stakes: !params?.showStakes,
        };
        const url = 'candidate/'.concat(params.publicKey);
        return this.send(url, _params);
    }
    async candidates(params) {
        const _params = {
            height: params?.height,
            include_stakes: params?.includeStakes || false,
            not_show_stakes: !params?.showStakes,
            status: params?.status || internal_1.CandidatesStatusEnum.ALL,
        };
        const url = 'candidates';
        return this.send(url, _params);
    }
    async missedBlocks(params) {
        if (!params.publicKey || !util_1.isValidPublicKey(params.publicKey)) {
            return Promise.reject(new util_1.TypedError('publicKey parameter not specified or invalid', 'ArgumentsRequired'));
        }
        const _params = {
            height: params?.height,
        };
        const url = 'missed_blocks/'.concat(params.publicKey);
        return this.send(url, _params);
    }
    async validators(params) {
        const _params = {
            height: params?.height,
        };
        const url = 'validators';
        return this.send(url, _params);
    }
    //----------- Coins/Tokens
    async coinInfo(params) {
        const _params = {
            height: params?.height,
        };
        const url = 'coin_info/'.concat(params.symbol.toUpperCase());
        return this.send(url, _params);
    }
    async coinInfoById(params) {
        if (!util_1.isInteger(Number(params.id)) || 0 > params.id) {
            return Promise.reject(new util_1.TypedError('id parameter not specified or invalid', 'ArgumentsRequired'));
        }
        const url = 'coin_info_by_id/'.concat(params.id.toString());
        const _params = {
            height: params?.height,
        };
        return this.send(url, _params);
    }
    async estimateCoinBuy(params) {
        if (!params.coinToSell && 0 > params.coinIdToSell) {
            return Promise.reject(new util_1.TypedError('coinIdToSell not specified', 'ArgumentsRequired'));
        }
        if (!params.coinToBuy && 0 > params.coinIdToBuy) {
            return Promise.reject(new util_1.TypedError('coinIdToBuy not specified', 'ArgumentsRequired'));
        }
        if (!params.valueToBuy) {
            return Promise.reject(new util_1.TypedError('valueToBuy not specified', 'ArgumentsRequired'));
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
        return this.send(url, {
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
        if (!util_1.isInteger(Number(params.coinIdToSell)) || 0 > params.coinIdToSell) {
            return Promise.reject(new util_1.TypedError('coinIdToSell not specified', 'ArgumentsRequired'));
        }
        if (!util_1.isInteger(Number(params.coinIdToBuy)) || 0 > params.coinIdToBuy) {
            return Promise.reject(new util_1.TypedError('coinIdToBuy not specified', 'ArgumentsRequired'));
        }
        if (!params?.valueToSell) {
            return Promise.reject(new util_1.TypedError('valueToSell not specified', 'ArgumentsRequired'));
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
            params.valueToSell = util_1.convertBipToPip(params.valueToSell);
        }
        const { coinIdToBuy: coin_id_to_buy, coinToBuy: coin_to_buy, coinIdToSell: coin_id_to_sell, coinToSell: coin_to_sell, valueToSell: value_to_sell, coinIdCommission: coin_id_commission, coinCommission: coin_commission, swapFrom: swap_from, route: route, } = params;
        const url = 'estimate_coin_sell';
        return this.send(url, {
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
            return Promise.reject(new util_1.TypedError('coinIdToSell not specified', 'ArgumentsRequired'));
        }
        if (!params.coinToBuy && 0 > params.coinIdToBuy) {
            return Promise.reject(new util_1.TypedError('coinIdToBuy not specified', 'ArgumentsRequired'));
        }
        if (!params.valueToSell) {
            return Promise.reject(new util_1.TypedError('VvalueToSell not specified', 'ArgumentsRequired'));
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
        return this.send(url, {
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
    async limitOrder(params) {
        if (!util_1.isInteger(Number(params.orderId)) || 0 > params.orderId) {
            return Promise.reject(new util_1.TypedError('orderId parameter not specified', 'ArgumentsRequired'));
        }
        const _params = {
            height: params?.height,
        };
        const url = 'limit_order/'.concat(params.orderId.toString());
        return this.send(url, _params);
    }
    async limitOrders(params) {
        if (!params.ids || !params.ids.length || params.ids.some(id => (!util_1.isInteger(Number(id)) || 0 > id))) {
            return Promise.reject(new util_1.TypedError('ids parameter not specified or some id invalid', 'ArgumentsRequired'));
        }
        const _params = {
            ids: params.ids,
            height: params?.height,
        };
        const url = 'limit_orders';
        return this.send(url, _params);
    }
    //----------- SwapPools
    async swapPool(params) {
        if (!util_1.isInteger(Number(params.coin0)) || 0 > params.coin0) {
            return Promise.reject(new util_1.TypedError('coin0 parameter not specified', 'ArgumentsRequired'));
        }
        if (!util_1.isInteger(Number(params.coin1)) || 0 > params.coin1) {
            return Promise.reject(new util_1.TypedError('coin1 parameter not specified', 'ArgumentsRequired'));
        }
        if (params?.provider && !util_1.isValidAddress(params.provider)) {
            return Promise.reject(new util_1.TypedError('provider parameter invalid', 'ArgumentsRequired'));
        }
        const _params = {
            height: params?.height,
        };
        let url = `swap_pool/${params.coin0.toString()}/${params.coin1.toString()}`;
        if (params?.provider) {
            url = url.concat(`/${params.provider.toString()}`);
        }
        return this.send(url, _params);
    }
    //----------- Prices
    // TODO: tx || params
    async estimateTxCommission(params) {
        if (!params.tx || !util_1.isHexString(params.tx)) {
            return Promise.reject(new util_1.TypedError('tx parameter not specified or not Hex string', 'ArgumentsRequired'));
        }
        const url = 'estimate_tx_commission/'.concat(params.tx);
        return this.send(url);
    }
    async minGasPrice(params) {
        const url = '/min_gas_price';
        const _params = { ...params };
        return this.send(url, _params);
    }
    async maxGasPrice(params) {
        const url = '/max_gas_price';
        const _params = {
            height: params?.height,
        };
        return this.send(url, _params);
    }
    async priceCommissions(params) {
        const url = '/price_commissions';
        const _params = {
            height: params?.height,
        };
        return this.send(url, _params);
    }
    //----------- Vote (GOVERNESS) Info
    async commissionVotes(params) {
        if (!params.targetVersion) {
            return Promise.reject(new util_1.TypedError('targetVersion parameter not specified', 'ArgumentsRequired'));
        }
        const _params = {
            height: params?.height,
        };
        const url = 'commission_votes/'.concat(params.targetVersion);
        return this.send(url, _params);
    }
    async haltVotes(params) {
        if (!params.height) {
            return Promise.reject(new util_1.TypedError('height parameter not specified', 'ArgumentsRequired'));
        }
        const url = 'halts/'.concat(params.height.toString());
        return this.send(url);
    }
    async netUpdateVotes(params) {
        if (!params.targetVersion) {
            return Promise.reject(new util_1.TypedError('targetVersion parameter not specified', 'ArgumentsRequired'));
        }
        const _params = {
            height: params?.height,
        };
        const url = 'update_votes/'.concat(params.targetVersion.toString());
        return this.send(url, _params);
    }
    //----------- Events
    async events(params) {
        if (!params.height) {
            return Promise.reject(new util_1.TypedError('height parameter not specified', 'ArgumentsRequired'));
        }
        const url = 'events/'.concat(params.height.toString());
        return this.send(url);
    }
    /** @hidden */
    async send(url, params, data, method = 'get') {
        return exponential_backoff_1.default(REQUEST_RETRY_WAIT, REQUEST_RETRY_NUMBER, REQUEST_RETRY_WAIT_BACKOFF, async () => {
            return await this.transport.send({ method, url, params, data })
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
