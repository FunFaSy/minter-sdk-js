import * as bip39 from 'bip39';
import {HDKey} from 'ethereum-cryptography/hdkey';
import {HDKeyT} from 'ethereum-cryptography/pure/hdkey';
import {assert, stripHexPrefix} from './util/external';
import {assertIsHexString, assertIsMnemonic, assertIsPositiveInt, base_encode} from './util';
import {MINTER_BIP44_DERIVATION_COIN_ID} from './constants';
import {KeyPair, KeyPairSecp256k1} from './key_pair';
import {Connection} from './connection';
import {Account} from './account';
import {Chain, ChainId} from './chain';
import {InMemoryKeyStore, KeyStore} from './key_stores';

/**
 *
 */
export abstract class HdWallet {
    /**
     * @see https://github.com/satoshilabs/slips/blob/ef6d7700cc/slip-0044.md
     *
     * @param coinId
     * @param walletId
     * @param pub
     */
    static makeDerivationBasePath(coinId = 491, walletId = 0, pub = true) {
        return `m/44'/${coinId}'/${walletId}'/${pub ? 0 : 1}`;
    }
}

/**
 *
 */
export class Wallet extends HdWallet {
    readonly coinId: number;
    readonly walletId: number;
    private readonly _hdKey: HDKeyT;
    private _connection: Connection;
    private _keyStore: KeyStore;
    private _accounts: Map<string, Account>;

    /**
     *
     * @param hdKey
     * @param walletId Number
     */
    constructor(hdKey: HDKeyT, walletId = 0) {
        super();
        assert(hdKey);

        this._hdKey = hdKey;
        this._accounts = new Map<string, Account>();

        this.coinId = MINTER_BIP44_DERIVATION_COIN_ID; // 491 Bip Minter // 60 Eth
        this.walletId = parseInt(walletId?.toString()) || 0;

        this.getDefaultConnection().then(con => this.setConnection(con));
        this.getDefaultKeystore().then(con => this.setKeyStore(con));
    }

    //------------------------------------------------------
    /**
     *
     * @param seed 0x prefixed Hex String
     * @param walletId Number
     */
    static async fromSeed(seed: string, walletId = 0): Promise<Wallet> {
        assertIsHexString(seed);

        const hdKey = HDKey.fromMasterSeed(Buffer.from(stripHexPrefix(seed), 'hex'));

        return new Wallet(hdKey, walletId);
    }

    /**
     *
     * @param mnemonic
     * @param walletId
     */
    static async fromMnemonic(mnemonic: string, walletId = 0): Promise<Wallet> {
        assertIsMnemonic(mnemonic);

        const seed = bip39.mnemonicToSeedSync(mnemonic).toString('hex');
        return Wallet.fromSeed(`0x${seed}`, walletId);
    }

    /**
     *
     * @param config
     */
    static async fromConfig(config: { seed: string; walletId?: number }): Promise<Wallet> {
        const {seed = '', walletId = 0} = config;
        return Wallet.fromSeed(seed, walletId);
    }

    //------------------------------------------------------
    /**
     *
     * @param chain
     */
    async getDefaultConnection(chain?: Chain): Promise<Connection> {
        const _chain = chain || new Chain(ChainId.MAINNET);
        return _chain.createJsonRpcConnection();
    }

    /**
     *
     */
    async getDefaultKeystore(): Promise<KeyStore> {
        return new InMemoryKeyStore();
    }

    /**
     *
     * @param connection Connection
     */
    async setConnection(connection: Connection): Promise<Wallet> {
        this._connection = connection;

        for (const acc of this._accounts.values()) {
            acc.setConnection(this._connection);
        }

        return this;
    }

    /**
     *
     * @param keyStore
     */
    async setKeyStore(keyStore: KeyStore): Promise<Wallet> {
        this._keyStore = keyStore;

        for (const acc of this._accounts.values()) {
            acc.setKeyStore(this._keyStore);
        }

        return this;
    }

    /**
     * Return KeyPair from HDKey for public or private usage.
     * Public means for receive operations in general.
     * Private means for exchange operations or accounting;
     *
     * @param index
     * @param pub
     */
    async getAccountKeyPair(index = 0, pub = true): Promise<KeyPair> {
        assertIsPositiveInt(index);

        const deriveBasePath = Wallet.makeDerivationBasePath(this.coinId, this.walletId, pub);
        const hdAccount = this._hdKey.derive(deriveBasePath).deriveChild(index);

        return new KeyPairSecp256k1(base_encode(hdAccount.privateKey));
    }

    /**
     *
     * @param index
     * @param pub
     */
    async getAccount(index = 0, pub = true): Promise<Account> {
        const accKey = `${this._connection.chainId}:${index}:${pub ? 'pub' : 'priv'}`;
        let account = this._accounts.get(accKey);

        if (!account) {
            account = new Account(await this.getAccountKeyPair(index, pub), this._connection);
            await account.setKeyStore(this._keyStore);
            this._accounts.set(accKey, account);
        }

        return account;
    }
}
