import {KeyPair} from '../key_pair';
import {ChainId} from '../chain/types';

/**
 * KeyStores are passed to {@link Minter} via {@link MinterConfig}
 * and are used by the {@link InMemorySigner} to sign transactions.
 *
 * @example {@link connect}
 */
export abstract class KeyStore {

  abstract setKey(chainId: ChainId, accountId: string, keyPair: KeyPair): Promise<void>;

  abstract getKey(chainId: ChainId, accountId: string): Promise<KeyPair>;

  abstract removeKey(chainId: ChainId, accountId: string): Promise<void>;

  abstract clear(): Promise<void>;

  abstract entries(): Promise<IterableIterator<[string, string]>>;

  abstract getChains(): Promise<string[]>;

  abstract getAccounts(chainId: ChainId): Promise<string[]>;

}
