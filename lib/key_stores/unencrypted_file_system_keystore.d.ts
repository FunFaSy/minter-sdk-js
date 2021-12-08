import { KeyStore } from './keystore';
import { KeyPair } from '../key_pair';
import { ChainId } from '../chain/types';
/** @hidden */
export declare function loadJsonFile(filename: string): Promise<any>;
/** @hidden */
export declare function readKeyFile(filename: string): Promise<{
    account_id: string;
    keyPair: KeyPair;
}>;
/**
 * This module contains the {@link UnencryptedFileSystemKeyStore} class which is used to store keys on the file system.
 */
export declare class UnencryptedFileSystemKeyStore extends KeyStore {
    /** @hidden */
    readonly keyDir: string;
    /**
     * @param keyDir base directory for key storage. Keys will be stored in `keyDir/chainId/accountId.json`
     */
    constructor(keyDir: string);
    /**
     * Store a {@link KeyPair} in an unencrypted file
     * @param chainId The targeted network. (ex. mainnet, testnet, etc…)
     * @param accountId The Minter account tied to the key pair
     * @param keyPair The key pair to store in local storage
     */
    setKey(chainId: ChainId, accountId: string, keyPair: KeyPair): Promise<void>;
    /**
     * Gets a {@link KeyPair} from an unencrypted file
     * @param chainId The targeted network. (ex. mainnet, testnet, etc…)
     * @param accountId The Minter account tied to the key pair
     * @returns {Promise<KeyPair>}
     */
    getKey(chainId: ChainId, accountId: string): Promise<KeyPair>;
    /**
     * Deletes an unencrypted file holding a {@link KeyPair}
     * @param chainId The targeted network. (ex. mainnet, testnet, etc…)
     * @param accountId The Minter account tied to the key pair
     */
    removeKey(chainId: ChainId, accountId: string): Promise<void>;
    /**
     * Deletes all unencrypted files from the `keyDir` path.
     */
    clear(): Promise<void>;
    /**
     * Get the network(s) from subdirectory names in `keyDir`
     * @returns {Promise<string[]>}
     */
    getChains(): Promise<string[]>;
    /**
     * Gets the account(s) files in `keyDir/chainId`
     * @param chainId The targeted network. (ex. mainnet, testnet, etc…)
     * @returns{Promise<string[]>}
     */
    getAccounts(chainId: ChainId): Promise<string[]>;
    /** @hidden */
    toString(): string;
    /** @hidden */
    private getKeyFilePath;
    entries(): Promise<IterableIterator<[string, string]>>;
}
