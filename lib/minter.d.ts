import {KeyStore} from './key_stores';
import {Signer} from './signer';

export interface MinterConfig {
    /** Holds {@link KeyPair | KeyPairs} for signing transactions */
    keyStore?: KeyStore;
    /** @hidden */
    signer?: Signer;
    /**
     * The balance transferred from the {@link MinterConfig.masterAccount | masterAccount} to a created account
     * @see {@link LocalAccountCreator}
     */
    initialBalance?: string;
    /**
     * The account to use when creating new accounts
     * @see {@link LocalAccountCreator}
     */
    masterAccount?: string;
    /**
     * {@link KeyPair | KeyPairs} are stored in a {@link KeyStore} under the `networkId` namespace.
     */
    networkId: string;
    /**
     * Minter RPC API url. used to make JSON RPC calls to interact with Minter.
     * @see {@link JsonRpcProvider.JsonRpcProvider | JsonRpcProvider}
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
 * const minter = new Minter(config);
 * ```
 */
export declare class Minter {
    readonly config: MinterConfig;

    constructor(config: Partial<MinterConfig>);
}
