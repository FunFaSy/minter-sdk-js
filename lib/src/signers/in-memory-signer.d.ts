/// <reference types="node" />
import { KeyPair, PublicKey, Signature } from '../key_pair';
import { SignedTransaction, Transaction } from '../transaction';
import { KeyStore } from '../key_stores';
import { ChainId } from '../chain/types';
import { Signer } from './signer';
/**
 * Signs using key store.
 */
export declare class InMemorySigner extends Signer {
    readonly keyStore: KeyStore;
    constructor(keyStore?: KeyStore);
    /**
     * Creates a single account Signer instance with account, network and keyPair provided.
     *
     * @param chainId The targeted network. (ex. mainnet, testnet, etc…)
     * @param accountId The Minter account to assign the key pair to
     * @param keyPair The keyPair to use for signing
     */
    static fromKeyPair(accountId: string, chainId: ChainId, keyPair: KeyPair): Promise<Signer>;
    /**
     * @param message A message to be signed, typically a serialized transaction
     * @param accountId the Minter account signing the message
     * @param chainId The targeted network. (ex. mainnet, testnet, etc…)
     * @returns {Promise<Signature>}
     */
    sign(message: Buffer, accountId: string, chainId: ChainId): Promise<Signature>;
    /**
     *
     * @param tx Transaction or raw Buffer
     * @param accountId
     * @param chainId
     */
    signTransaction(tx: Transaction, accountId: string, chainId: ChainId): Promise<SignedTransaction>;
    /**
     * Gets the existing public key for a given account
     * @param accountId The Minter account to assign a public key to
     * @param chainId The targeted network. (ex. mainnet, testnet, etc…)
     * @returns {Promise<PublicKey>} Returns the public key or null if not found
     */
    publicKey(accountId: string, chainId: ChainId): Promise<PublicKey>;
    toString(): string;
}
