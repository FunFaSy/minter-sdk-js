/**
 * MINTER JSON HTTP RPC API PROVIDER
 * @module
 */
import {Provider} from './provider';
import {
  convertBipToPip,
  isHexString,
  isInteger,
  isString,
  isValidAddress,
  isValidPublicKey,
  logWarning,
  TypedError,
} from '../util';
import exponentialBackoff from '../util/exponential-backoff';
import {parseRpcError} from './errors';
import * as rpcTypes from './internal';
import {CandidatesStatusEnum} from './internal';
import HttpTransport, {HttpTransportConfig} from '../transport/http-transport';
import JsonSerializer from '../transport/json-serializer';

// Default number of retries before giving up on a request.
const REQUEST_RETRY_NUMBER = 3;

// Default wait until next retry in millis.
const REQUEST_RETRY_WAIT = 500;

// Exponential back off for waiting to retry.
const REQUEST_RETRY_WAIT_BACKOFF = 1.5;

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
export class JsonRpcProvider extends Provider {
  /** @hidden */
  protected readonly config: HttpTransportConfig;
  protected readonly transport: HttpTransport;

  /**
   * @param config
   */
  constructor(config: string | HttpTransportConfig) {
    super();

    if (isString(config)) {
      this.config = {baseURL: config.toString()} as HttpTransportConfig;
    }
    //
    else {
      this.config = config as HttpTransportConfig;
    }

    this.transport = new HttpTransport(this.config, new JsonSerializer());
  }

  //-----------  Blockchain
  async block(params: rpcTypes.BlockRequest): Promise<rpcTypes.BlockResponse> {
    if (!params.height || isNaN(Number(params.height))) {
      return Promise.reject(new TypedError('height parameter required', 'ArgumentsRequired'));
    }

    const _params = {
      fields    : params?.fields || [],
      failed_txs: !!params?.failedTxs,
    };
    const url = 'block/'.concat(params.height.toString());
    return this.send(url, _params);
  }

  async blocks(params: rpcTypes.BlocksRequest): Promise<rpcTypes.BlocksResponse> {

    if (!params.fromHeight || !params.toHeight) {
      return Promise.reject(new TypedError('fromHeight/toHeight  parameters required', 'ArgumentsRequired'));
    }

    const _params = {
      from_height: params.fromHeight,
      to_height  : params.toHeight,
      fields     : params?.fields || [],
      failed_txs : !!params?.failedTxs,
    };
    const url = 'blocks';
    return this.send(url, _params);
  }

  async genesis(): Promise<rpcTypes.GenesisResponse> {
    return this.send('genesis');
  }

  async netInfo(): Promise<rpcTypes.NetInfoResponse> {
    return this.send('net_info');
  }

  async sendTransaction(params: rpcTypes.SendTransactionRequest): Promise<rpcTypes.SendTransactionResponse> {
    if ((!params.tx)) {
      return Promise.reject(new TypedError('tx parameter not specified', 'ArgumentsRequired'));
    }

    return this.send('send_transaction', undefined, params, 'post');
  }

  async status(): Promise<rpcTypes.NodeStatusResponse> {
    return this.send('status');
  }

  async transaction(params: rpcTypes.TransactionRequest): Promise<rpcTypes.TransactionResponse> {
    if (!params.hash) {
      return Promise.reject(new TypedError('hash parameter not specified', 'ArgumentsRequired'));
    }

    const url = 'transaction/'.concat(params.hash);
    return this.send(url, params);
  }

  async transactions(params: rpcTypes.TransactionsRequest): Promise<rpcTypes.TransactionsResponse> {
    if (!params.query) {
      return Promise.reject(new TypedError('query  parameters required', 'ArgumentsRequired'));
    }

    const query = params.query.replace(/"/g, '\'').replace(/\s/g, '');
    const _params = {
      query,
      page    : params?.page && 0 < params.page ? params.page : 1,
      per_page: params?.perPage && 0 < params.perPage ? params.perPage : 30,
    };
    const url = 'transactions';
    return this.send(url, _params);
  }

  async unconfirmedTransactions(params: rpcTypes.UnconfirmedTxsRequest): Promise<rpcTypes.UnconfirmedTxsResponse> {
    const _params = {
      limit: params?.limit || 30,
    };
    const url = 'unconfirmed_txs';
    return this.send(url, _params);
  }

  async networkVersion(): Promise<rpcTypes.NetworkVersionResponse> {
    const _params = {};
    const url = 'version_network';
    return this.send(url, _params);
  }

  //----------- Account
  async address(params: rpcTypes.AddressStateRequest): Promise<rpcTypes.AddressStateResponse> {
    if (!params.address || !isValidAddress(params.address)) {
      return Promise.reject(new TypedError('address parameter not specified or invalid', 'ArgumentsRequired'));
    }

    const _params = {
      height   : params?.height || undefined,
      delegated: !!params?.delegated,
    };
    const url = 'address/'.concat(params.address);
    return this.send(url, _params);
  }

  async addresses(params: rpcTypes.AddressesRequest): Promise<rpcTypes.AddressesResponse> {
    if (!params.addresses || !params.addresses.length || params.addresses.some(a => !isValidAddress(a))) {
      return Promise.reject(
        new TypedError('addresses parameter not specified or some address invalid', 'ArgumentsRequired'));
    }

    const _params = {
      addresses: params.addresses,
      height   : params?.height || undefined,
      delegated: !!params?.delegated,
    };
    const url = 'addresses';
    return this.send(url, _params);
  }

  async frozen(params: rpcTypes.AddressFrozenRequest): Promise<rpcTypes.AddressFrozenResponse> {
    if (!params.address || !isValidAddress(params.address)) {
      return Promise.reject(new TypedError('address parameter not specified or invalid', 'ArgumentsRequired'));
    }

    const _params = {
      height : params?.height,
      coin_id: params?.coinId,
    };
    const url = `frozen/${params.address}`;
    return this.send(url, _params);
  }

  async waitlist(params: rpcTypes.AddressWaitListRequest): Promise<rpcTypes.AddressWaitListResponse> {
    if (!params.address || !isValidAddress(params.address)) {
      return Promise.reject(new TypedError('address parameter not specified or invalid', 'ArgumentsRequired'));
    }
    const _params = {
      height    : params?.height,
      public_key: params?.publicKey,
    };
    const url = `waitlist/${params.address}`;
    return this.send(url, _params);
  }

  //----------- Validator
  async candidate(params: rpcTypes.CandidateRequest): Promise<rpcTypes.CandidateResponse> {
    if (!params.publicKey || !isValidPublicKey(params.publicKey)) {
      return Promise.reject(new TypedError('publicKey parameter not specified or invalid', 'ArgumentsRequired'));
    }

    const _params = {
      height         : params?.height,
      not_show_stakes: !params?.showStakes,
    };
    const url = 'candidate/'.concat(params.publicKey);
    return this.send(url, _params);
  }

  async candidates(params?: rpcTypes.CandidatesRequest): Promise<rpcTypes.CandidatesResponse> {
    const _params = {
      height         : params?.height,
      include_stakes : params?.includeStakes || false,
      not_show_stakes: !params?.showStakes,
      status         : params?.status || CandidatesStatusEnum.ALL,
    };
    const url = 'candidates';

    return this.send(url, _params);
  }

  async missedBlocks(params: rpcTypes.MissedBlocksRequest): Promise<rpcTypes.MissedBlocksResponse> {
    if (!params.publicKey || !isValidPublicKey(params.publicKey)) {
      return Promise.reject(new TypedError('publicKey parameter not specified or invalid', 'ArgumentsRequired'));
    }
    const _params = {
      height: params?.height,
    };
    const url = 'missed_blocks/'.concat(params.publicKey);
    return this.send(url, _params);
  }

  async validators(params?: rpcTypes.ValidatorsRequest): Promise<rpcTypes.ValidatorsResponse> {
    const _params = {
      height: params?.height,
    };
    const url = 'validators';
    return this.send(url, _params);
  }

  //----------- Coins/Tokens
  async coinInfo(params: rpcTypes.CoinInfoRequest): Promise<rpcTypes.CoinInfoResponse> {
    const _params = {
      height: params?.height,
    };
    const url = 'coin_info/'.concat(params.symbol.toUpperCase());

    return this.send(url, _params);
  }

  async coinInfoById(params: rpcTypes.CoinInfoByIdRequest): Promise<rpcTypes.CoinInfoByIdResponse> {
    if (!isInteger(Number(params.id)) || 0 > params.id) {
      return Promise.reject(new TypedError('id parameter not specified or invalid', 'ArgumentsRequired'));
    }

    const url = 'coin_info_by_id/'.concat(params.id.toString());
    const _params = {
      height: params?.height,
    };

    return this.send(url, _params);
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
  async limitOrder(params: rpcTypes.LimitOrderRequest): Promise<rpcTypes.LimitOrderResponse> {
    if (!isInteger(Number(params.orderId)) || 0 > params.orderId) {
      return Promise.reject(new TypedError('orderId parameter not specified', 'ArgumentsRequired'));
    }

    const _params = {
      height: params?.height,
    };
    const url = 'limit_order/'.concat(params.orderId.toString());

    return this.send(url, _params);
  }

  async limitOrders(params: rpcTypes.LimitOrdersRequest): Promise<rpcTypes.LimitOrdersResponse> {

    if (!params.ids || !params.ids.length || params.ids.some(id => (!isInteger(Number(id)) || 0 > id))) {
      return Promise.reject(
        new TypedError('ids parameter not specified or some id invalid', 'ArgumentsRequired'));
    }

    const _params = {
      ids   : params.ids,
      height: params?.height,
    };
    const url = 'limit_orders';

    return this.send(url, _params);
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

    return this.send(url, _params);
  }

  //----------- Prices
  // TODO: tx || params
  async estimateTxCommission(params: rpcTypes.EstimateTxCommissionRequest): Promise<rpcTypes.EstimateTxCommissionResponse> {
    if (!params.tx || !isHexString(params.tx)) {
      return Promise.reject(new TypedError('tx parameter not specified or not Hex string', 'ArgumentsRequired'));
    }

    const url = 'estimate_tx_commission/'.concat(params.tx);
    return this.send(url);
  }

  async minGasPrice(params?: rpcTypes.MinGasPriceRequest): Promise<rpcTypes.MinGasPriceResponse> {
    const url = '/min_gas_price';

    const _params = {...params};

    return this.send(url, _params);
  }

  async maxGasPrice(params?: rpcTypes.MaxGasPriceRequest): Promise<rpcTypes.MaxGasPriceResponse> {
    const url = '/max_gas_price';

    const _params = {
      height: params?.height,
    };

    return this.send(url, _params);
  }

  async priceCommissions(params: rpcTypes.PriceCommissionsRequest): Promise<rpcTypes.PriceCommissionsResponse> {
    const url = '/price_commissions';

    const _params = {
      height: params?.height,
    };

    return this.send(url, _params);
  }

  //----------- Vote (GOVERNESS) Info
  async commissionVotes(params: rpcTypes.CommissionVotesRequest): Promise<rpcTypes.CommissionVotesResponse> {
    if (!params.targetVersion) {
      return Promise.reject(new TypedError('targetVersion parameter not specified', 'ArgumentsRequired'));
    }
    const _params = {
      height: params?.height,
    };

    const url = 'commission_votes/'.concat(params.targetVersion);
    return this.send(url, _params);
  }

  async haltVotes(params: rpcTypes.HaltVotesRequest): Promise<rpcTypes.HaltVotesResponse> {
    if (!params.height) {
      return Promise.reject(new TypedError('height parameter not specified', 'ArgumentsRequired'));
    }

    const url = 'halts/'.concat(params.height.toString());

    return this.send(url);
  }

  async netUpdateVotes(params: rpcTypes.NetUpdateVotesRequest): Promise<rpcTypes.NetUpdateVotesResponse> {
    if (!params.targetVersion) {
      return Promise.reject(new TypedError('targetVersion parameter not specified', 'ArgumentsRequired'));
    }
    const _params = {
      height: params?.height,
    };
    const url = 'update_votes/'.concat(params.targetVersion.toString());

    return this.send(url, _params);
  }

  //----------- Events
  async events(params: rpcTypes.EventsRequest): Promise<rpcTypes.EventsResponse> {
    if (!params.height) {
      return Promise.reject(new TypedError('height parameter not specified', 'ArgumentsRequired'));
    }

    const url = 'events/'.concat(params.height.toString());

    return this.send(url);
  }

  /** @hidden */
  async send<T>(url: string, params?: Record<string, unknown>, data?: Record<string, unknown>, method = 'get'): Promise<T> {
    return exponentialBackoff(REQUEST_RETRY_WAIT, REQUEST_RETRY_NUMBER, REQUEST_RETRY_WAIT_BACKOFF,
      async () => {

        return await this.transport.send({method, url, params, data})
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
