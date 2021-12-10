/** @module */

import {Connection} from './connection';
import {Address, KeyPair, PublicKey, Signature} from './key_pair';
import {InMemoryKeyStore, KeyStore} from './key_stores';
import {InMemorySigner, Signer} from './signer';
import {ChainId} from './chain/types';
import {SignedTransaction, Transaction} from './transaction/transaction';
import {TypedError} from './util';
import {Coin} from './providers/internal';
import * as rpcTypes from './providers/internal';

export interface AccountState extends rpcTypes.AddressStateResponse {
    frozen?: {
        height: string;
        address: string;
        candidate_key: string;
        coin: Coin;
        value: string;

    }[];
    waiting?: {
        public_key: string;
        coin: Coin;
        value: string;
    }[];
}

// TODO: AccountBuilder

/**
 * This class provides common account related RPC calls including signing transactions with a {@link KeyPair}.
 *
 * @example {@link }
 * @hint Use {@link Wallet} in the browser to manage derivited Accounts.
 * @see {@link }
 */
export class Account {
    readonly publicKey: PublicKey; // enough for reading operations
    readonly address: Address;

    protected _keyStore: KeyStore; //  KeyStore keep account keys
    protected _signer: Signer; // Wrap KeyStore for sign operations
    protected _connection: Connection;// Provider + Signer connects Account to network

    constructor(keyPair: KeyPair, connection: Connection) {
        this.publicKey = keyPair.publicKey;
        this.address = this.publicKey.address;
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

    async balance(params?: rpcTypes.AddressStateRequest): Promise<rpcTypes.AddressStateResponse> {
        const address = this.address.toString();
        const _params = params || {};

        return this._connection.provider.address({..._params, address});
    }

    async frozen(params?: rpcTypes.AddressFrozenRequest): Promise<rpcTypes.AddressFrozenResponse> {
        const address = this.address.toString();
        const _params = params || {};

        return this._connection.provider.frozen({..._params, address});
    }

    async waitlist(params?: rpcTypes.AddressWaitListRequest): Promise<rpcTypes.AddressWaitListResponse> {
        const address = this.address.toString();
        const _params = params || {};

        return this._connection.provider.waitlist({..._params, address});
    }

    async state(): Promise<AccountState> {
        const address = this.address.toString();
        const state = {} as AccountState;

        const dfdBalance = this.balance({address, delegated: true});
        const dfdFrozen = this.frozen({address});
        const dfdWaitlist = this.waitlist({address});

        return Promise.all([dfdBalance, dfdFrozen, dfdWaitlist]).then(([balance, frozen, waiting]) => {
            Object.assign(state, balance);
            state.frozen = frozen.frozen;
            state.waiting = waiting.list;

            return state;
        });
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

        const signedTx = await this.signTx(tx);

        return this._connection.provider.sendTransaction({tx: signedTx.toString()}).then(res => res.hash);
    }

    //-----------------------------------------------

}
