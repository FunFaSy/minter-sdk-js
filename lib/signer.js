"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemorySigner = exports.Signer = void 0;
const in_memory_key_store_1 = require("./key_stores/in_memory_key_store");
const key_pair_1 = require("./key_pair");
const util_1 = require("./util");
/**
 * General signing interface, can be used for in memory signing, RPC singing, external wallet, HSM, etc.
 */
class Signer {
}
exports.Signer = Signer;
/**
 * Signs using in memory key store.
 */
class InMemorySigner extends Signer {
    constructor(keyStore) {
        super();
        this.keyStore = keyStore;
    }
    /**
     * Creates a single account Signer instance with account, network and keyPair provided.
     *
     * @param networkId The targeted network. (ex. mainnet, testnet, etc…)
     * @param accountId The Minter account to assign the key pair to
     * @param keyPair The keyPair to use for signing
     */
    static async fromKeyPair(networkId, accountId, keyPair) {
        const keyStore = new in_memory_key_store_1.InMemoryKeyStore();
        await keyStore.setKey(networkId, accountId, keyPair);
        return new InMemorySigner(keyStore);
    }
    /**
     * Creates a public key for the account given
     * @param accountId The Minter account to assign a public key to
     * @param networkId The targeted network. (ex. mainnet, testnet, etc…)
     * @returns {Promise<PublicKey>}
     */
    async createKey(accountId, networkId) {
        const keyPair = key_pair_1.KeyPair.fromRandom(key_pair_1.KeyType.SECP256K1);
        await this.keyStore.setKey(networkId, accountId, keyPair);
        return keyPair.publicKey();
    }
    /**
     * Gets the existing public key for a given account
     * @param accountId The Minter account to assign a public key to
     * @param networkId The targeted network. (ex. mainnet, testnet, etc…)
     * @returns {Promise<PublicKey>} Returns the public key or null if not found
     */
    async publicKey(accountId, networkId) {
        const keyPair = await this.keyStore.getKey(networkId, accountId);
        if (keyPair === null) {
            return null;
        }
        return keyPair.publicKey();
    }
    /**
     * @param message A message to be signed, typically a serialized transaction
     * @param accountId the Minter account signing the message
     * @param networkId The targeted network. (ex. mainnet, testnet, etc…)
     * @returns {Promise<Signature>}
     */
    async signMessage(message, accountId, networkId) {
        if (!accountId) {
            throw new Error('InMemorySigner requires provided account id');
        }
        const keyPair = await this.keyStore.getKey(networkId, accountId);
        if (keyPair === null) {
            throw new Error(`Key for ${accountId} not found in ${networkId}`);
        }
        const hash = util_1.sha256(message);
        return keyPair.sign(hash);
    }
    /**
     *
     * @param tx
     * @param accountId
     * @param networkId
     */
    async signTransaction(tx, accountId, networkId) {
        if (!accountId) {
            throw new Error('InMemorySigner requires provided account id');
        }
        const keyPair = await this.keyStore.getKey(networkId, accountId);
        if (keyPair === null) {
            throw new Error(`Key for ${accountId} not found in ${networkId}`);
        }
        const hash = tx.hash(false);
        return keyPair.sign(hash);
    }
    toString() {
        return `InMemorySigner(${this.keyStore})`;
    }
}
exports.InMemorySigner = InMemorySigner;
