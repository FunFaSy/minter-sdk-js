import {InMemoryKeyStore} from '../key_stores/in_memory_key_store';
import {KeyPair, PublicKey, Signature} from '../key_pair';
import {sha256} from '../util';
import {SignedTransaction, Transaction} from '../transaction';
import {KeyStore} from '../key_stores';
import {ChainId} from '../chain/types';
import {Signer} from './signer';

/**
 * Signs using key store.
 */
export class InMemorySigner extends Signer {
    readonly keyStore: KeyStore;

    constructor(keyStore?: KeyStore) {
        super();

        this.keyStore = keyStore || new InMemoryKeyStore();
    }

    /**
     * Creates a single account Signer instance with account, network and keyPair provided.
     *
     * @param chainId The targeted network. (ex. mainnet, testnet, etc…)
     * @param accountId The Minter account to assign the key pair to
     * @param keyPair The keyPair to use for signing
     */
    static async fromKeyPair(accountId: string, chainId: ChainId, keyPair: KeyPair): Promise<Signer> {
        if (!accountId) {
            throw new Error('InMemorySigner requires provided account id');
        }
        if (!chainId) {
            throw new Error('InMemorySigner requires provided chain id');
        }

        const keyStore = new InMemoryKeyStore();
        await keyStore.setKey(chainId, accountId, keyPair);
        return new InMemorySigner(keyStore);
    }

    /**
     * @param message A message to be signed, typically a serialized transaction
     * @param accountId the Minter account signing the message
     * @param chainId The targeted network. (ex. mainnet, testnet, etc…)
     * @returns {Promise<Signature>}
     */
    async sign(message: Buffer, accountId: string, chainId: ChainId): Promise<Signature> {
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

        const hash = sha256(message);
        return keyPair.sign(hash);
    }

    /**
     *
     * @param tx Transaction or raw Buffer
     * @param accountId
     * @param chainId
     */
    async signTransaction(tx: Transaction , accountId: string, chainId: ChainId): Promise<SignedTransaction> {
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
    async publicKey(accountId: string, chainId: ChainId): Promise<PublicKey> {
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
        return keyPair.publicKey();
    }

    toString(): string {
        return `InMemorySigner(${this.keyStore})`;
    }
}
