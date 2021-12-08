import { HDKeyT } from 'ethereum-cryptography/pure/hdkey';
import { KeyPair } from './key_pair';
import { Connection } from './connection';
import { Account } from './account';
import { Chain } from './chain';
import { KeyStore } from './key_stores';
/**
 *
 */
export declare abstract class HdWallet {
    /**
     * @see https://github.com/satoshilabs/slips/blob/ef6d7700cc/slip-0044.md
     *
     * @param coinId
     * @param walletId
     * @param pub
     */
    static makeDerivationBasePath(coinId?: number, walletId?: number, pub?: boolean): string;
}
/**
 *
 */
export declare class Wallet extends HdWallet {
    private readonly _hdKey;
    private _connection;
    private _keyStore;
    private _accounts;
    readonly coinId: number;
    readonly walletId: number;
    /**
     *
     * @param hdKey
     * @param walletId Number
     */
    constructor(hdKey: HDKeyT, walletId?: number);
    /**
     *
     * @param seed 0x prefixed Hex String
     * @param walletId Number
     */
    static fromSeed(seed: string, walletId?: number): Promise<Wallet>;
    /**
     *
     * @param mnemonic
     * @param walletId
     */
    static fromMnemonic(mnemonic: string, walletId?: number): Promise<Wallet>;
    /**
     *
     * @param config
     */
    static fromConfig(config: {
        seed: string;
        walletId?: number;
    }): Promise<Wallet>;
    /**
     *
     * @param chain
     */
    getDefaultConnection(chain?: Chain): Promise<Connection>;
    /**
     *
     */
    getDefaultKeystore(): Promise<KeyStore>;
    /**
     *
     * @param connection Connection
     */
    setConnection(connection: Connection): Promise<Wallet>;
    /**
     *
     * @param keyStore
     */
    setKeyStore(keyStore: KeyStore): Promise<Wallet>;
    /**
     * Return KeyPair from HDKey for public or private usage.
     * Public means for receive operations in general.
     * Private means for exchange operations or accounting;
     *
     * @param index
     * @param pub
     */
    getAccountKeyPair(index?: number, pub?: boolean): Promise<KeyPair>;
    /**
     *
     * @param index
     * @param pub
     */
    getAccount(index?: number, pub?: boolean): Promise<Account>;
}
