import { KeyStore } from './keystore';
import { KeyPair } from '../key_pair';
import { ChainId } from '../chain/types';
/**
 * This class is used to store keys in the browsers local storage.
 *
 * @example {@link }
 * @example
 * ```js
 * import { connect, keyStores } from 'minter-api-js';
 *
 * const keyStore = new keyStores.BrowserLocalStorageKeyStore();
 * const config = {
 *   keyStore, // instance of BrowserLocalStorageKeyStore
 *   chainId: 'testnet',
 *   nodeUrl: 'https://rpc.testnet.minter.org',
 *   walletUrl: 'https://wallet.testnet.minter.org',
 *   helperUrl: 'https://helper.testnet.minter.org',
 *   explorerUrl: 'https://explorer.testnet.minter.org'
 * };
 *
 * // inside an async function
 * const minter = await connect(config)
 * ```
 */
export declare class BrowserLocalStorageKeyStore extends KeyStore {
    /** @hidden */
    private storage;
    /** @hidden */
    private prefix;
    /**
     * @param localStorage defaults to window.localStorage
     * @param prefix defaults to `minter-api-js:keystore:`
     */
    constructor(localStorage?: any, prefix?: string);
    /**
     * Stores a {@link KeyPair} in local storage.
     * @param chainId The targeted network. (ex. mainnet, testnet, etc…)
     * @param accountId The Minter account tied to the key pair
     * @param keyPair The key pair to store in local storage
     */
    setKey(chainId: ChainId, accountId: string, keyPair: KeyPair): Promise<void>;
    /**
     * Gets a {@link KeyPair} from local storage
     * @param chainId The targeted network. (ex. mainnet, testnet, etc…)
     * @param accountId The Minter account tied to the key pair
     * @returns {Promise<KeyPair>}
     */
    getKey(chainId: ChainId, accountId: string): Promise<KeyPair>;
    /**
     * Removes a {@link KeyPair} from local storage
     * @param chainId The targeted network. (ex. mainnet, testnet, etc…)
     * @param accountId The Minter account tied to the key pair
     */
    removeKey(chainId: ChainId, accountId: string): Promise<void>;
    /**
     * Removes all items that start with `prefix` from local storage
     */
    clear(): Promise<void>;
    /**
     * Get the network(s) from local storage
     * @returns {Promise<string[]>}
     */
    getChains(): Promise<string[]>;
    /**
     * Gets the account(s) from local storage
     * @param chainId The targeted network. (ex. mainnet, testnet, etc…)
     * @returns{Promise<string[]>}
     */
    getAccounts(chainId: ChainId): Promise<string[]>;
    /**
     * @hidden
     * Helper function to retrieve a local storage key
     * @param chainId The targeted network. (ex. mainnet, testnet, etc…)
     * @param accountId The Minter account tied to the storage keythat's sought
     * @returns {string} An example might be: `minter-api-js:keystore:minter-friend:default`
     */
    private storageKeyForSecretKey;
    /** @hidden */
    private storageKeys;
    entries(): Promise<IterableIterator<[string, string]>>;
}
