"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowserLocalStorageKeyStore = void 0;
const keystore_1 = require("./keystore");
const key_pair_1 = require("../key_pair");
const LOCAL_STORAGE_KEY_PREFIX = 'minter-sdk-js:keystore:';
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
class BrowserLocalStorageKeyStore extends keystore_1.KeyStore {
    /**
     * @param localStorage defaults to window.localStorage
     * @param prefix defaults to `minter-api-js:keystore:`
     */
    constructor(localStorage = window.localStorage, prefix = LOCAL_STORAGE_KEY_PREFIX) {
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
    async setKey(chainId, accountId, keyPair) {
        this.storage.setItem(this.storageKeyForSecretKey(chainId, accountId), keyPair.toString());
    }
    /**
     * Gets a {@link KeyPair} from local storage
     * @param chainId The targeted network. (ex. mainnet, testnet, etc…)
     * @param accountId The Minter account tied to the key pair
     * @returns {Promise<KeyPair>}
     */
    async getKey(chainId, accountId) {
        const value = this.storage.getItem(this.storageKeyForSecretKey(chainId, accountId));
        if (!value) {
            return null;
        }
        return key_pair_1.KeyPair.fromString(value);
    }
    /**
     * Removes a {@link KeyPair} from local storage
     * @param chainId The targeted network. (ex. mainnet, testnet, etc…)
     * @param accountId The Minter account tied to the key pair
     */
    async removeKey(chainId, accountId) {
        this.storage.removeItem(this.storageKeyForSecretKey(chainId, accountId));
    }
    /**
     * Removes all items that start with `prefix` from local storage
     */
    async clear() {
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
    async getChains() {
        const result = new Set();
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
    async getAccounts(chainId) {
        const result = new Array();
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
    storageKeyForSecretKey(chainId, accountId) {
        return `${this.prefix}${accountId}:${chainId}`;
    }
    /** @hidden */
    *storageKeys() {
        for (let i = 0; i < this.storage.length; i++) {
            yield this.storage.key(i);
        }
    }
    async entries() {
        const self = this;
        function* entries() {
            for (let i = 0; i < self.storage.length; i++) {
                const key = self.storage.key(i);
                const value = self.storage.getItem(key);
                yield [key, value || null];
            }
        }
        ;
        return entries();
    }
}
exports.BrowserLocalStorageKeyStore = BrowserLocalStorageKeyStore;
