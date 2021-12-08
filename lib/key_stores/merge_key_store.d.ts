import { KeyStore } from './keystore';
import { KeyPair } from '../key_pair';
import { ChainId } from '../chain/types';
/**
 * Keystore which can be used to merge multiple key stores into one virtual key store.
 */
interface MergeKeyStoreOptions {
    writeKeyStoreIndex: number;
}
export declare class MergeKeyStore extends KeyStore {
    keyStores: KeyStore[];
    private options;
    /**
     * @param keyStores read calls are attempted from start to end of array
     * @param options
     * @param options.writeKeyStoreIndex the keystore index that will receive all write calls
     */
    constructor(keyStores: KeyStore[], options?: MergeKeyStoreOptions);
    /**
     * Store a {@link KeyPair} to the first index of a key store array
     * @param chainId The targeted network. (ex. mainnet, testnet, etc…)
     * @param accountId The Minter account tied to the key pair
     * @param keyPair The key pair to store in local storage
     */
    setKey(chainId: ChainId, accountId: string, keyPair: KeyPair): Promise<void>;
    /**
     * Gets a {@link KeyPair} from the array of key stores
     * @param chainId The targeted network. (ex. 0, betanet, etc…)
     * @param accountId The Minter account tied to the key pair
     * @returns {Promise<KeyPair>}
     */
    getKey(chainId: ChainId, accountId: string): Promise<KeyPair>;
    /**
     * Removes a {@link KeyPair} from the array of key stores
     * @param chainId The targeted network. (ex. mainnet, testnet, etc…)
     * @param accountId The Minter account tied to the key pair
     */
    removeKey(chainId: ChainId, accountId: string): Promise<void>;
    /**
     * Removes all items from each key store
     */
    clear(): Promise<void>;
    /**
     * Get the network(s) from the array of key stores
     * @returns {Promise<string[]>}
     */
    getChains(): Promise<string[]>;
    /**
     * Gets the account(s) from the array of key stores
     * @param chainId The targeted network. (ex. mainnet, testnet, etc…)
     * @returns{Promise<string[]>}
     */
    getAccounts(chainId: ChainId): Promise<string[]>;
    entries(): Promise<IterableIterator<[string, string]>>;
    /** @hidden */
    toString(): string;
}
export {};
