import {Connection} from './connection';
import {Address, KeyPair, PublicKey, Signature} from './key_pair';
import {InMemoryKeyStore, KeyStore} from './key_stores';
import {InMemorySigner, Signer} from './signer';
import {ChainId} from './chain/types';
import {SignedTransaction, Transaction} from './transaction/transaction';
import {TypedError} from './util';
import {Coin} from './providers/internal';

export interface AccountState {
    balance?: {
        bip_value: string;
        coin: Coin;
        value: string;
    }[];
    delegated?: {
        bip_value: string;
        coin: Coin;
        value: string;
    }[];
    frozen?: {
        height: string;
        address: string;
        candidate_key: string;
        coin: Coin;
        value: string;

    }[];
    waitlisted?: {
        public_key: string;
        coin: Coin;
        value: string;
    }[];
    total?: {
        bip_value: string;
        coin: Coin;
        value: string;
    }[];
    transaction_count?: string;
    bip_value?: string;
    multisig?: boolean;
}

// TODO: AccountBuilder

/**
 *
 */
export class Account {
    readonly publicKey: PublicKey; // enough for reading operations
    readonly address: Address;

    protected _keyStore: KeyStore; //  KeyStore keep account keys
    protected _signer: Signer; // Wrap KeyStore for sign operations
    protected _connection: Connection;// Provider + Signer connects Account to network

    constructor(keyPair: KeyPair, connection: Connection) {
        this.publicKey = keyPair.publicKey();
        this.address = this.publicKey.address();
        this._connection = connection;

        this._keyStore = new InMemoryKeyStore();
        this._signer = new InMemorySigner(this._keyStore);

        this._keyStore.setKey(this._connection.chainId, this.address.toString(), keyPair).then();
    }

    async setKeyStore(keyStore: KeyStore): Promise<Account> {
        const oldStore = this._keyStore;

        this._keyStore = keyStore;
        this._signer = new InMemorySigner(this._keyStore);

        for (const [k, v] of await oldStore.entries()) {

            const parts = k.split(':');

            await this._keyStore.setKey(parts[0] as ChainId, parts[1], KeyPair.fromString(v));
        }

        return this;
    }

    async setConnection(connection: Connection): Promise<Account> {
        this._connection = connection;
        return this;
    }

    async nonce(): Promise<number> {
        return this.state().then(res => Number(res?.transaction_count) + 1);
    }

    async state(): Promise<AccountState> {
        const address = this.address.toString();
        return this._connection.provider.address({address});
    }

    //-----------------------------------------------
    /**
     *
     * @param message
     */
    async sign(message: Buffer): Promise<Signature> {
        if (!this._signer) {
            throw new TypedError('Accont has no ');
        }

        return this._signer.sign(message, this.address.toString(), this._connection.chainId);
    }

    /**
     *
     * @param tx
     */
    async signTx(tx: Transaction): Promise<SignedTransaction> {
        return this._signer.signTransaction(tx, this.address.toString(), this._connection.chainId);
    }

    /**
     *  Sign transaction and send to node
     * @return string Transaction hash
     * @param tx
     */
    async signAndSendTx(tx: Transaction): Promise<string> {

        const signedTx = this._signer.signTransaction(tx, this.address.toString(), this._connection.chainId);

        return this._connection.provider.sendTransaction({tx: signedTx.toString()}).then(res => res.hash);
    }

    //-----------------------------------------------

}
