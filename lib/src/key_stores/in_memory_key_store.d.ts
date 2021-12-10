import { KeyStore } from './keystore';
import { KeyPair } from '../key_pair';
import { ChainId } from '../chain/types';
/**
 * Simple in-memory keystore for mainly for testing purposes.
 */
export declare class InMemoryKeyStore extends KeyStore {
    /** @hidden */
    private storage;
    /**
     *
     */
    constructor();
    /**
     * Stores a {@KeyPair} in in-memory storage item
     * @param chainId The targeted network. (ex. mainnet, testnet, etc…)
     * @param accountId The Minter account tied to the key pair
     * @param keyPair The key pair to store in local storage
     */
    setKey(chainId: ChainId, accountId: string, keyPair: KeyPair): Promise<void>;
    /**
     * Gets a {@link KeyPair} from in-memory storage
     * @param chainId The targeted network. (ex. mainnet, testnet, etc…)
     * @param accountId The Minter account tied to the key pair
     * @returns {Promise<KeyPair>}
     */
    getKey(chainId: ChainId, accountId: string): Promise<KeyPair>;
    /**
     * Removes a {@link KeyPair} from in-memory storage
     * @param chainId The targeted network. (ex. mainnet, testnet, etc…)
     * @param accountId The Minter account tied to the key pair
     */
    removeKey(chainId: ChainId, accountId: string): Promise<void>;
    clear(): Promise<void>;
    entries(): Promise<IterableIterator<[string, string]>>;
    /**
     * Get the network(s) from in-memory storage
     * @returns {Promise<string[]>}
     */
    getChains(): Promise<string[]>;
    /**
     * Gets the account(s) identifiers from in-memory storage
     * @param chainId The targeted network. (ex. mainnet, testnet, etc…)
     * @returns{Promise<string[]>}
     */
    getAccounts(chainId: ChainId): Promise<string[]>;
    /** @hidden */
    toString(): string;
}
