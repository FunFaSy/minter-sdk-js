import {KeyPair} from '../key_pair';

/**
 * KeyStores are passed to {@link Minter} via {@link MinterConfig}
 * and are used by the {@link InMemorySigner} to sign transactions.
 *
 * @example {@link connect}
 */
export abstract class KeyStore {
    abstract setKey(networkId: string, accountId: string, keyPair: KeyPair): Promise<void>;
    abstract getKey(networkId: string, accountId: string): Promise<KeyPair>;
    abstract removeKey(networkId: string, accountId: string): Promise<void>;
    abstract clear(): Promise<void>;
    abstract getNetworks(): Promise<string[]>;
    abstract getAccounts(networkId: string): Promise<string[]>;
}
