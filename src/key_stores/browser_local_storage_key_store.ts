import {KeyStore} from './keystore';
import {KeyPair} from '../key_pair';
import {ChainId} from '../chain/types';

const LOCAL_STORAGE_KEY_PREFIX = 'minter-api-js:keystore:';

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
export class BrowserLocalStorageKeyStore extends KeyStore {
    /** @hidden */
    private storage: any;
    /** @hidden */
    private prefix: string;

    /**
     * @param localStorage defaults to window.localStorage
     * @param prefix defaults to `minter-api-js:keystore:`
     */
    constructor(localStorage: any = window.localStorage, prefix = LOCAL_STORAGE_KEY_PREFIX) {
        super();
        this.storage = localStorage;
        this.prefix = prefix;
    }

    /**
     * Stores a {@link KeyPair} in local storage.
     * @param chainId The targeted network. (ex. mainnet, testnet, etc…)
     * @param accountId The Minter account tied to the key pair
     * @param keyPair The key pair to store in local storage
     */
    async setKey(chainId: ChainId, accountId: string, keyPair: KeyPair): Promise<void> {
        this.storage.setItem(this.storageKeyForSecretKey(chainId, accountId), keyPair.toString());
    }

    /**
     * Gets a {@link KeyPair} from local storage
     * @param chainId The targeted network. (ex. mainnet, testnet, etc…)
     * @param accountId The Minter account tied to the key pair
     * @returns {Promise<KeyPair>}
     */
    async getKey(chainId: ChainId, accountId: string): Promise<KeyPair> {
        const value = this.storage.getItem(this.storageKeyForSecretKey(chainId, accountId));
        if (!value) {
            return null;
        }
        return KeyPair.fromString(value);
    }

    /**
     * Removes a {@link KeyPair} from local storage
     * @param chainId The targeted network. (ex. mainnet, testnet, etc…)
     * @param accountId The Minter account tied to the key pair
     */
    async removeKey(chainId: ChainId, accountId: string): Promise<void> {
        this.storage.removeItem(this.storageKeyForSecretKey(chainId, accountId));
    }

    /**
     * Removes all items that start with `prefix` from local storage
     */
    async clear(): Promise<void> {
        for (const key of this.storageKeys()) {
            if (key.startsWith(this.prefix)) {
                this.storage.removeItem(key);
            }
        }
    }

    /**
     * Get the network(s) from local storage
     * @returns {Promise<string[]>}
     */
    async getChains(): Promise<string[]> {
        const result = new Set<string>();
        for (const key of this.storageKeys()) {
            if (key.startsWith(this.prefix)) {
                const parts = key.substring(this.prefix.length).split(':');
                result.add(parts[1]);
            }
        }
        return Array.from(result.values());
    }

    /**
     * Gets the account(s) from local storage
     * @param chainId The targeted network. (ex. mainnet, testnet, etc…)
     * @returns{Promise<string[]>}
     */
    async getAccounts(chainId: ChainId): Promise<string[]> {
        const result = new Array<string>();
        for (const key of this.storageKeys()) {
            if (key.startsWith(this.prefix)) {
                const parts = key.substring(this.prefix.length).split(':');
                if (parts[1] === chainId) {
                    result.push(parts[0]);
                }
            }
        }
        return result;
    }

    /**
     * @hidden
     * Helper function to retrieve a local storage key
     * @param chainId The targeted network. (ex. mainnet, testnet, etc…)
     * @param accountId The Minter account tied to the storage keythat's sought
     * @returns {string} An example might be: `minter-api-js:keystore:minter-friend:default`
     */
    private storageKeyForSecretKey(chainId: ChainId, accountId: string): string {
        return `${this.prefix}${accountId}:${chainId}`;
    }

    /** @hidden */
    private* storageKeys(): IterableIterator<string> {
        for (let i = 0; i < this.storage.length; i++) {
            yield this.storage.key(i);
        }
    }

    async entries(): Promise<IterableIterator<[string, string]>> {
       function *entries():IterableIterator<[string, string]> {
            for (let i = 0; i < this.storage.length; i++) {
                const key = this.storage.key(i);
                const value = this.storage.getItem(key);

                yield [key, value || null];
            }
        };

       return entries();
    }
}
