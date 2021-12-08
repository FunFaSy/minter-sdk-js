import {KeyStore} from './keystore';
import {KeyPair} from '../key_pair';
import {ChainId} from '../chain/types';

/**
 * Simple in-memory keystore for mainly for testing purposes.
 */
export class InMemoryKeyStore extends KeyStore {
    /** @hidden */
    private storage: Map<string, string>;

    /**
     *
     */
    constructor() {
        super();
        this.storage = new Map<string, string>();
    }

    /**
     * Stores a {@KeyPair} in in-memory storage item
     * @param chainId The targeted network. (ex. mainnet, testnet, etc…)
     * @param accountId The Minter account tied to the key pair
     * @param keyPair The key pair to store in local storage
     */
    async setKey(chainId: ChainId, accountId: string, keyPair: KeyPair): Promise<void> {
        this.storage.set(`${chainId}:${accountId}`, keyPair.toString());
    }

    /**
     * Gets a {@link KeyPair} from in-memory storage
     * @param chainId The targeted network. (ex. mainnet, testnet, etc…)
     * @param accountId The Minter account tied to the key pair
     * @returns {Promise<KeyPair>}
     */
    async getKey(chainId: ChainId, accountId: string): Promise<KeyPair> {
        const value = this.storage.get(`${chainId}:${accountId}`);

        if (!value) {
            return null;
        }

        return KeyPair.fromString(value);
    }

    /**
     * Removes a {@link KeyPair} from in-memory storage
     * @param chainId The targeted network. (ex. mainnet, testnet, etc…)
     * @param accountId The Minter account tied to the key pair
     */
    async removeKey(chainId: ChainId, accountId: string): Promise<void> {
        this.storage.delete(`${chainId}:${accountId}`);
    }

    async clear(): Promise<void> {
        this.storage.clear();
    }

    async  entries(): Promise<IterableIterator<[string, string]>> {
        return this.storage.entries();
    }

    /**
     * Get the network(s) from in-memory storage
     * @returns {Promise<string[]>}
     */
    async getChains(): Promise<string[]> {
        const result = new Set<string>();

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
    async getAccounts(chainId: ChainId): Promise<string[]> {

        const result = new Array<string>();

        for (const key of this.storage.keys()) {
            const parts = key.split(':');

            if (parts[0] as ChainId === chainId) {
                result.push(parts[parts.length - 1]);
            }
        }

        return result;
    }

    /** @hidden */
    toString(): string {
        return 'InMemoryKeyStore';
    }



}
