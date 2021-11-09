import { KeyStore } from './keystore';
import { KeyPair } from '../key_pair';
/** @hidden */
export declare function loadJsonFile(filename: string): Promise<any>;
/** @hidden */
export declare function readKeyFile(filename: string): Promise<[string, KeyPair]>;
/**
 * This module contains the {@link UnencryptedFileSystemKeyStore} class which is used to store keys on the file system.
 *
 * @example {@link https://docs.minter.org/docs/develop/front-end/naj-quick-reference#key-store}
 * @example
 * ```js
 * const { homedir } = require('os');
 * const { connect, keyStores } = require('minter-api-js');
 *
 * const keyStore = new keyStores.UnencryptedFileSystemKeyStore(`${homedir()}/.minter-credentials`);
 * const config = {
 *   keyStore, // instance of UnencryptedFileSystemKeyStore
 *   networkId: 'testnet',
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
export declare class UnencryptedFileSystemKeyStore extends KeyStore {
    /** @hidden */
    readonly keyDir: string;
    /**
     * @param keyDir base directory for key storage. Keys will be stored in `keyDir/networkId/accountId.json`
     */
    constructor(keyDir: string);
    /**
     * Store a {@link KeyPair} in an unencrypted file
     * @param networkId The targeted network. (ex. mainnet, testnet, etc…)
     * @param accountId The Minter account tied to the key pair
     * @param keyPair The key pair to store in local storage
     */
    setKey(networkId: string, accountId: string, keyPair: KeyPair): Promise<void>;
    /**
     * Gets a {@link KeyPair} from an unencrypted file
     * @param networkId The targeted network. (ex. mainnet, testnet, etc…)
     * @param accountId The Minter account tied to the key pair
     * @returns {Promise<KeyPair>}
     */
    getKey(networkId: string, accountId: string): Promise<KeyPair>;
    /**
     * Deletes an unencrypted file holding a {@link KeyPair}
     * @param networkId The targeted network. (ex. mainnet, testnet, etc…)
     * @param accountId The Minter account tied to the key pair
     */
    removeKey(networkId: string, accountId: string): Promise<void>;
    /**
     * Deletes all unencrypted files from the `keyDir` path.
     */
    clear(): Promise<void>;
    /**
     * Get the network(s) from files in `keyDir`
     * @returns {Promise<string[]>}
     */
    getNetworks(): Promise<string[]>;
    /**
     * Gets the account(s) files in `keyDir/networkId`
     * @param networkId The targeted network. (ex. mainnet, testnet, etc…)
     * @returns{Promise<string[]>}
     */
    getAccounts(networkId: string): Promise<string[]>;
    /** @hidden */
    toString(): string;
    /** @hidden */
    private getKeyFilePath;
}
