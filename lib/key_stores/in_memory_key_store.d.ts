import { KeyStore } from './keystore';
import { KeyPair } from '../key_pair';
/**
 * Simple in-memory keystore for mainly for testing purposes.
 */
export declare class InMemoryKeyStore extends KeyStore {
    /** @hidden */
    private keys;
    constructor();
    /**
     * Stores a {@KeyPair} in in-memory storage item
     * @param networkId The targeted network. (ex. mainnet, testnet, etc…)
     * @param accountId The Minter account tied to the key pair
     * @param keyPair The key pair to store in local storage
     */
    setKey(networkId: string, accountId: string, keyPair: KeyPair): Promise<void>;
    /**
     * Gets a {@link KeyPair} from in-memory storage
     * @param networkId The targeted network. (ex. mainnet, testnet, etc…)
     * @param accountId The Minter account tied to the key pair
     * @returns {Promise<KeyPair>}
     */
    getKey(networkId: string, accountId: string): Promise<KeyPair>;
    /**
     * Removes a {@link KeyPair} from in-memory storage
     * @param networkId The targeted network. (ex. mainnet, testnet, etc…)
     * @param accountId The Minter account tied to the key pair
     */
    removeKey(networkId: string, accountId: string): Promise<void>;
    /**
     * Removes all {@link KeyPairs} from in-memory storage
     */
    clear(): Promise<void>;
    /**
     * Get the network(s) from in-memory storage
     * @returns {Promise<string[]>}
     */
    getNetworks(): Promise<string[]>;
    /**
     * Gets the account(s) from in-memory storage
     * @param networkId The targeted network. (ex. mainnet, testnet, etc…)
     * @returns{Promise<string[]>}
     */
    getAccounts(networkId: string): Promise<string[]>;
    /** @hidden */
    toString(): string;
}
