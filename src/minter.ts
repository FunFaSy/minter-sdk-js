/**
 * This module contains the main class developers will use to interact with Minter.
 * The {@link Minter} class is used to interact with {@link Account | Accounts} through the {@link JsonRpcProvider}.
 * It is configured via the {@link MinterConfig}.
 *
 * @example {@link https://#}
 *
 * @module minter
 */
import {deepExtend} from './util';
import {Connection} from './connection';
import {HttpTransportConfig} from './transport/http-transport';
import {ChainId} from './chain/types';
import {Chain} from './chain/chain';
import {Wallet} from './wallet';
import {Provider} from './providers';

/**
 *
 */
export interface MinterConfig {
  /**
   *
   */
  chainId: string | ChainId;

  /**
   * Minter RPC API url. used to make JSON RPC calls to interact with Minter.
   * @see {@link JsonRpcProvider}
   */
  nodeUrl?: string;
  /**
   *
   */
  rpcConfig?: HttpTransportConfig

  /**
   * Minter wallet url used to redirect users to their wallet in browser applications.
   * @see {@link https://}
   */
  walletUrl?: string;
}

/**
 * This is the main class developers should use to interact with Minter.
 * @example
 * ```js
 * ```
 */
export class Minter {
  readonly config: MinterConfig;
  readonly chain: Chain;
  readonly connection: Connection;

  constructor(config: Partial<MinterConfig>) {
    this.config = deepExtend({}, config) as MinterConfig;

    this.chain = new Chain(config.chainId);

    this.connection = Connection.fromConfig({
      chainId : this.chain.chainId,
      provider: {
        type: 'JsonRpcProvider',
        args: {
          config: config.rpcConfig || undefined,
          url   : config.nodeUrl || this.chain.urls?.api?.node?.http[0],
        },
      },
    });

  }

  /**
   *
   */
  get rpc(): Provider {
    return this.connection.provider;
  }

  /**
   *
   * @param params
   * @param walletId
   */
  async walletFrom(params: { mnemonic?: string, seed?: string }, walletId?: number): Promise<Wallet> {

    if (params?.seed?.length) {
      return Wallet.fromSeed(params?.seed, walletId).then(wall => wall.setConnection(this.connection));
    } else if (params?.mnemonic?.length) {
      return Wallet.fromMnemonic(params?.mnemonic, walletId).then(wall => wall.setConnection(this.connection));
    }

    return Promise.reject(new Error('Invalid parameters'));
  }

  /**
   *
   */
  async newWallet(): Promise<{ wall: Wallet, mnemonic: string }> {
    const mnemonic = Wallet.generateMnemonic();
    const wall = await this.walletFrom({mnemonic});

    return {wall, mnemonic};
  }

}
