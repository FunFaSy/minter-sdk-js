"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemorySigner = void 0;
const in_memory_key_store_1 = require("../key_stores/in_memory_key_store");
const util_1 = require("../util");
const signer_1 = require("./signer");
/**
 * Signs using key store.
 */
class InMemorySigner extends signer_1.Signer {
    constructor(keyStore) {
        super();
        this.keyStore = keyStore || new in_memory_key_store_1.InMemoryKeyStore();
    }
    /**
     * Creates a single account Signer instance with account, network and keyPair provided.
     *
     * @param chainId The targeted network. (ex. mainnet, testnet, etc…)
     * @param accountId The Minter account to assign the key pair to
     * @param keyPair The keyPair to use for signing
     */
    static async fromKeyPair(accountId, chainId, keyPair) {
        if (!accountId) {
            throw new Error('InMemorySigner requires provided account id');
        }
        if (!chainId) {
            throw new Error('InMemorySigner requires provided chain id');
        }
        const keyStore = new in_memory_key_store_1.InMemoryKeyStore();
        await keyStore.setKey(chainId, accountId, keyPair);
        return new InMemorySigner(keyStore);
    }
    /**
     * @param message A message to be signed, typically a serialized transaction
     * @param accountId the Minter account signing the message
     * @param chainId The targeted network. (ex. mainnet, testnet, etc…)
     * @returns {Promise<Signature>}
     */
    async sign(message, accountId, chainId) {
        if (!accountId) {
            throw new Error('InMemorySigner requires provided account id');
        }
        if (!chainId) {
            throw new Error('InMemorySigner requires provided chain id');
        }
        const keyPair = await this.keyStore.getKey(chainId, accountId);
        if (keyPair === null) {
            throw new Error(`Key for ${accountId} not found in ${chainId}`);
        }
        const hash = util_1.sha256(message);
        return keyPair.sign(hash);
    }
    /**
     *
     * @param tx Transaction or raw Buffer
     * @param accountId
     * @param chainId
     */
    async signTransaction(tx, accountId, chainId) {
        if (!accountId) {
            throw new Error('InMemorySigner requires provided account id');
        }
        if (!chainId) {
            throw new Error('InMemorySigner requires provided chain id');
        }
        const keyPair = await this.keyStore.getKey(chainId, accountId);
        if (keyPair === null) {
            throw new Error(`Key for ${accountId} not found in ${chainId}`);
        }
        return tx.sign(keyPair);
    }
    /**
     * Gets the existing public key for a given account
     * @param accountId The Minter account to assign a public key to
     * @param chainId The targeted network. (ex. mainnet, testnet, etc…)
     * @returns {Promise<PublicKey>} Returns the public key or null if not found
     */
    async publicKey(accountId, chainId) {
        if (!accountId) {
            throw new Error('InMemorySigner requires provided account id');
        }
        if (!chainId) {
            throw new Error('InMemorySigner requires provided chain id');
        }
        const keyPair = await this.keyStore.getKey(chainId, accountId);
        if (keyPair === null) {
            return null;
        }
        return keyPair.publicKey;
    }
    toString() {
        return `InMemorySigner(${this.keyStore})`;
    }
}
exports.InMemorySigner = InMemorySigner;
