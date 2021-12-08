import {KeyStore} from './keystore';
import {KeyPair} from '../key_pair';
import {ChainId} from '../chain/types';

/**
 * Keystore which can be used to merge multiple key stores into one virtual key store.
 */

interface MergeKeyStoreOptions {
    writeKeyStoreIndex: number;
}

export class MergeKeyStore extends KeyStore {
    keyStores: KeyStore[];
    private options: MergeKeyStoreOptions;

    /**
     * @param keyStores read calls are attempted from start to end of array
     * @param options
     * @param options.writeKeyStoreIndex the keystore index that will receive all write calls
     */
    constructor(keyStores: KeyStore[], options: MergeKeyStoreOptions = {writeKeyStoreIndex: 0}) {
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
    async setKey(chainId: ChainId, accountId: string, keyPair: KeyPair): Promise<void> {
        await this.keyStores[this.options.writeKeyStoreIndex].setKey(chainId, accountId, keyPair);
    }

    /**
     * Gets a {@link KeyPair} from the array of key stores
     * @param chainId The targeted network. (ex. 0, betanet, etc…)
     * @param accountId The Minter account tied to the key pair
     * @returns {Promise<KeyPair>}
     */
    async getKey(chainId: ChainId, accountId: string): Promise<KeyPair> {
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
    async removeKey(chainId: ChainId, accountId: string): Promise<void> {
        for (const keyStore of this.keyStores) {
            await keyStore.removeKey(chainId, accountId);
        }
    }

    /**
     * Removes all items from each key store
     */
    async clear(): Promise<void> {
        for (const keyStore of this.keyStores) {
            await keyStore.clear();
        }
    }

    /**
     * Get the network(s) from the array of key stores
     * @returns {Promise<string[]>}
     */
    async getChains(): Promise<string[]> {
        const result = new Set<string>();
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
    async getAccounts(chainId: ChainId): Promise<string[]> {
        const result = new Set<string>();
        for (const keyStore of this.keyStores) {
            for (const account of await keyStore.getAccounts(chainId)) {
                result.add(account);
            }
        }
        return Array.from(result);
    }

    async entries(): Promise<IterableIterator<[string, string]>> {
        function* entries(): IterableIterator<[string, string]> {
            for (const keyStore of this.keyStores) {
                for (const [key, val] of keyStore.entries()) {
                    yield [key, val];
                }
            }
        };

        return entries();
    }

    /** @hidden */
    toString(): string {
        return `MergeKeyStore(${this.keyStores.join(', ')})`;
    }

}
