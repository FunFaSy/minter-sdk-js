"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wallet = exports.HdWallet = void 0;
const bip39 = __importStar(require("bip39"));
const hdkey_1 = require("ethereum-cryptography/hdkey");
const external_1 = require("./util/external");
const util_1 = require("./util");
const constants_1 = require("./constants");
const key_pair_1 = require("./key_pair");
const account_1 = require("./account");
const chain_1 = require("./chain");
const key_stores_1 = require("./key_stores");
/**
 *
 */
class HdWallet {
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
exports.HdWallet = HdWallet;
/**
 *
 */
class Wallet extends HdWallet {
    /**
     *
     * @param hdKey
     * @param walletId Number
     */
    constructor(hdKey, walletId = 0) {
        super();
        external_1.assert(hdKey);
        this._hdKey = hdKey;
        this._accounts = new Map();
        this.coinId = constants_1.MINTER_BIP44_DERIVATION_COIN_ID; // 491 Bip Minter // 60 Eth
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
    static async fromSeed(seed, walletId = 0) {
        util_1.assertIsHexString(seed);
        const hdKey = hdkey_1.HDKey.fromMasterSeed(Buffer.from(external_1.stripHexPrefix(seed), 'hex'));
        return new Wallet(hdKey, walletId);
    }
    /**
     *
     * @param mnemonic
     * @param walletId
     */
    static async fromMnemonic(mnemonic, walletId = 0) {
        util_1.assertIsMnemonic(mnemonic);
        const seed = bip39.mnemonicToSeedSync(mnemonic).toString('hex');
        return Wallet.fromSeed(`0x${seed}`, walletId);
    }
    /**
     *
     * @param config
     */
    static async fromConfig(config) {
        const { seed = '', walletId = 0 } = config;
        return Wallet.fromSeed(seed, walletId);
    }
    //------------------------------------------------------
    /**
     *
     * @param chain
     */
    async getDefaultConnection(chain) {
        const _chain = chain || new chain_1.Chain(chain_1.ChainId.MAINNET);
        return _chain.createJsonRpcConnection();
    }
    /**
     *
     */
    async getDefaultKeystore() {
        return new key_stores_1.InMemoryKeyStore();
    }
    /**
     *
     * @param connection Connection
     */
    async setConnection(connection) {
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
    async setKeyStore(keyStore) {
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
    async getAccountKeyPair(index = 0, pub = true) {
        util_1.assertIsPositiveInt(index);
        const deriveBasePath = Wallet.makeDerivationBasePath(this.coinId, this.walletId, pub);
        const hdAccount = this._hdKey.derive(deriveBasePath).deriveChild(index);
        return new key_pair_1.KeyPairSecp256k1(util_1.base_encode(hdAccount.privateKey));
    }
    /**
     *
     * @param index
     * @param pub
     */
    async getAccount(index = 0, pub = true) {
        const accKey = `${this._connection.chainId}:${index}:${pub ? 'pub' : 'priv'}`;
        let account = this._accounts.get(accKey);
        if (!account) {
            account = new account_1.Account(await this.getAccountKeyPair(index, pub), this._connection);
            await account.setKeyStore(this._keyStore);
            this._accounts.set(accKey, account);
        }
        return account;
    }
}
exports.Wallet = Wallet;
