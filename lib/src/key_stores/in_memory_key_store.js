"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryKeyStore = void 0;
const keystore_1 = require("./keystore");
const key_pair_1 = require("../key_pair");
/**
 * Simple in-memory keystore for mainly for testing purposes.
 */
class InMemoryKeyStore extends keystore_1.KeyStore {
    /**
     *
     */
    constructor() {
        super();
        this.storage = new Map();
    }
    /**
     * Stores a {@KeyPair} in in-memory storage item
     * @param chainId The targeted network. (ex. mainnet, testnet, etc…)
     * @param accountId The Minter account tied to the key pair
     * @param keyPair The key pair to store in local storage
     */
    async setKey(chainId, accountId, keyPair) {
        this.storage.set(`${chainId}:${accountId}`, keyPair.toString());
    }
    /**
     * Gets a {@link KeyPair} from in-memory storage
     * @param chainId The targeted network. (ex. mainnet, testnet, etc…)
     * @param accountId The Minter account tied to the key pair
     * @returns {Promise<KeyPair>}
     */
    async getKey(chainId, accountId) {
        const value = this.storage.get(`${chainId}:${accountId}`);
        if (!value) {
            return null;
        }
        return key_pair_1.KeyPair.fromString(value);
    }
    /**
     * Removes a {@link KeyPair} from in-memory storage
     * @param chainId The targeted network. (ex. mainnet, testnet, etc…)
     * @param accountId The Minter account tied to the key pair
     */
    async removeKey(chainId, accountId) {
        this.storage.delete(`${chainId}:${accountId}`);
    }
    async clear() {
        this.storage.clear();
    }
    async entries() {
        return this.storage.entries();
    }
    /**
     * Get the network(s) from in-memory storage
     * @returns {Promise<string[]>}
     */
    async getChains() {
        const result = new Set();
        for (const key of this.storage.keys()) {
            const parts = key.split(':');
            result.add(parts[0]);
        }
        return Array.from(result.values());
    }
    /**
     * Gets the account(s) identifiers from in-memory storage
     * @param chainId The targeted network. (ex. mainnet, testnet, etc…)
     * @returns{Promise<string[]>}
     */
    async getAccounts(chainId) {
        const result = new Array();
        for (const key of this.storage.keys()) {
            const parts = key.split(':');
            if (parts[0] === chainId) {
                result.push(parts[parts.length - 1]);
            }
        }
        return result;
    }
    /** @hidden */
    toString() {
        return 'InMemoryKeyStore';
    }
}
exports.InMemoryKeyStore = InMemoryKeyStore;
