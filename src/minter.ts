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
import {KeyStore} from './key_stores';
import {Signer} from './signer';

export interface MinterConfig {
    /** Holds {@link KeyPair | KeyPairs} for signing transactions */
    keyStore?: KeyStore;

    /** @hidden */
    signer?: Signer;

    /**
     * {@link KeyPair | KeyPairs} are stored in a {@link KeyStore} under the `networkId` namespace.
     */
    networkId: string;

    /**
     * Minter RPC API url. used to make JSON RPC calls to interact with Minter.
     * @see {@link JsonRpcProvider}
     */
    nodeUrl: string;

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

    //readonly connection: Connection;

    constructor(config: Partial<MinterConfig>) {
      this.config = deepExtend({}, config) as MinterConfig;

      // this.connection = Connection.fromConfig({
      //     networkId: config.networkId,
      //     provider: { type: 'JsonRpcProvider', args: { url: config.nodeUrl } },
      //     signer: config.signer || { type: 'InMemorySigner', keyStore: config.keyStore || config.deps.keyStore }
      // });

    }
}
