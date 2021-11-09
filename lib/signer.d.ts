/// <reference types="node" />
import { InMemoryKeyStore } from './key_stores/in_memory_key_store';
import { KeyPair, PublicKey, Signature } from './key_pair';
import { Transaction } from './transaction/transaction';
/**
 * General signing interface, can be used for in memory signing, RPC singing, external wallet, HSM, etc.
 */
export declare abstract class Signer {
    /**
     * Creates new key and returns public key.
     */
    abstract createKey(accountId: string, networkId?: string): Promise<PublicKey>;
    /**
     * Returns public key for given account / network.
     * @param accountId accountId to retrieve from.
     * @param networkId The targeted network. (ex. mainnet, testnet, etc…)
     */
    abstract publicKey(accountId?: string, networkId?: string): Promise<PublicKey>;
    /**
     * Signs given message, by first hashing with sha256.
     * @param message message to sign.
     * @param accountId accountId to use for signing.
     * @param networkId The targeted network. (ex. mainnet, testnet, etc…)
     */
    abstract signMessage(message: Uint8Array, accountId?: string, networkId?: string): Promise<Signature>;
}
/**
 * Signs using in memory key store.
 */
export declare class InMemorySigner extends Signer {
    readonly keyStore: InMemoryKeyStore;
    constructor(keyStore: InMemoryKeyStore);
    /**
     * Creates a single account Signer instance with account, network and keyPair provided.
     *
     * Intended to be useful for temporary keys (e.g. claiming a Linkdrop).
     *
     * @param networkId The targeted network. (ex. mainnet, testnet, etc…)
     * @param accountId The Minter account to assign the key pair to
     * @param keyPair The keyPair to use for signing
     */
    static fromKeyPair(networkId: string, accountId: string, keyPair: KeyPair): Promise<Signer>;
    /**
     * Creates a public key for the account given
     * @param accountId The Minter account to assign a public key to
     * @param networkId The targeted network. (ex. mainnet, testnet, etc…)
     * @returns {Promise<PublicKey>}
     */
    createKey(accountId: string, networkId: string): Promise<PublicKey>;
    /**
     * Gets the existing public key for a given account
     * @param accountId The Minter account to assign a public key to
     * @param networkId The targeted network. (ex. mainnet, testnet, etc…)
     * @returns {Promise<PublicKey>} Returns the public key or null if not found
     */
    publicKey(accountId?: string, networkId?: string): Promise<PublicKey>;
    /**
     * @param message A message to be signed, typically a serialized transaction
     * @param accountId the Minter account signing the message
     * @param networkId The targeted network. (ex. mainnet, testnet, etc…)
     * @returns {Promise<Signature>}
     */
    signMessage(message: Buffer, accountId?: string, networkId?: string): Promise<Signature>;
    /**
     *
     * @param tx
     * @param accountId
     * @param networkId
     */
    signTransaction(tx: Transaction, accountId?: string, networkId?: string): Promise<Signature>;
    toString(): string;
}
