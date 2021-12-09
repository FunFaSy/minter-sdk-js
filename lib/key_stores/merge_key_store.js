"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MergeKeyStore = void 0;
const keystore_1 = require("./keystore");
class MergeKeyStore extends keystore_1.KeyStore {
    /**
     * @param keyStores read calls are attempted from start to end of array
     * @param options
     * @param options.writeKeyStoreIndex the keystore index that will receive all write calls
     */
    constructor(keyStores, options = { writeKeyStoreIndex: 0 }) {
        super();
        this.options = options;
        this.keyStores = keyStores;
    }
    /**
     * Store a {@link KeyPair} to the first index of a key store array
     * @param chainId The targeted network. (ex. mainnet, testnet, etc…)
     * @param accountId The Minter account tied to the key pair
     * @param keyPair The key pair to store in local storage
     */
    async setKey(chainId, accountId, keyPair) {
        await this.keyStores[this.options.writeKeyStoreIndex].setKey(chainId, accountId, keyPair);
    }
    /**
     * Gets a {@link KeyPair} from the array of key stores
     * @param chainId The targeted network. (ex. 0, betanet, etc…)
     * @param accountId The Minter account tied to the key pair
     * @returns {Promise<KeyPair>}
     */
    async getKey(chainId, accountId) {
        for (const keyStore of this.keyStores) {
            const keyPair = await keyStore.getKey(chainId, accountId);
            if (keyPair) {
                return keyPair;
            }
        }
        return null;
    }
    /**
     * Removes a {@link KeyPair} from the array of key stores
     * @param chainId The targeted network. (ex. mainnet, testnet, etc…)
     * @param accountId The Minter account tied to the key pair
     */
    async removeKey(chainId, accountId) {
        for (const keyStore of this.keyStores) {
            await keyStore.removeKey(chainId, accountId);
        }
    }
    /**
     * Removes all items from each key store
     */
    async clear() {
        for (const keyStore of this.keyStores) {
            await keyStore.clear();
        }
    }
    /**
     * Get the network(s) from the array of key stores
     * @returns {Promise<string[]>}
     */
    async getChains() {
        const result = new Set();
        for (const keyStore of this.keyStores) {
            for (const network of await keyStore.getChains()) {
                result.add(network);
            }
        }
        return Array.from(result);
    }
    /**
     * Gets the account(s) from the array of key stores
     * @param chainId The targeted network. (ex. mainnet, testnet, etc…)
     * @returns{Promise<string[]>}
     */
    async getAccounts(chainId) {
        const result = new Set();
        for (const keyStore of this.keyStores) {
            for (const account of await keyStore.getAccounts(chainId)) {
                result.add(account);
            }
        }
        return Array.from(result);
    }
    async entries() {
        function* entries() {
            for (const keyStore of this.keyStores) {
                for (const [key, val] of keyStore.entries()) {
                    yield [key, val];
                }
            }
        }
        return entries();
    }
    /** @hidden */
    toString() {
        return `MergeKeyStore(${this.keyStores.join(', ')})`;
    }
}
exports.MergeKeyStore = MergeKeyStore;
