"use strict";
/** @module */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Account = void 0;
const key_pair_1 = require("./key_pair");
const key_stores_1 = require("./key_stores");
const signer_1 = require("./signer");
const util_1 = require("./util");
// TODO: AccountBuilder
/**
 * This class provides common account related RPC calls including signing transactions with a {@link KeyPair}.
 *
 * @example {@link }
 * @hint Use {@link Wallet} in the browser to manage derivited Accounts.
 * @see {@link }
 */
class Account {
    constructor(keyPair, connection) {
        this.publicKey = keyPair.publicKey;
        this.address = this.publicKey.address;
        this._connection = connection;
        this._keyStore = new key_stores_1.InMemoryKeyStore();
        this._signer = new signer_1.InMemorySigner(this._keyStore);
        this._keyStore.setKey(this._connection.chainId, this.address.toString(), keyPair).then();
    }
    async setKeyStore(keyStore) {
        const oldStore = this._keyStore;
        this._keyStore = keyStore;
        this._signer = new signer_1.InMemorySigner(this._keyStore);
        for (const [k, v] of await oldStore.entries()) {
            const parts = k.split(':');
            await this._keyStore.setKey(parts[0], parts[1], key_pair_1.KeyPair.fromString(v));
        }
        return this;
    }
    async setConnection(connection) {
        this._connection = connection;
        return this;
    }
    async nonce() {
        return this.state().then(res => Number(res?.transaction_count) + 1);
    }
    async balance(params) {
        const address = this.address.toString();
        const _params = params || {};
        return this._connection.provider.address({ ..._params, address });
    }
    async frozen(params) {
        const address = this.address.toString();
        const _params = params || {};
        return this._connection.provider.frozen({ ..._params, address });
    }
    async waitlist(params) {
        const address = this.address.toString();
        const _params = params || {};
        return this._connection.provider.waitlist({ ..._params, address });
    }
    async state() {
        const address = this.address.toString();
        const state = {};
        const dfdBalance = this.balance({ address, delegated: true });
        const dfdFrozen = this.frozen({ address });
        const dfdWaitlist = this.waitlist({ address });
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
    async sign(message) {
        if (!this._signer) {
            throw new util_1.TypedError('Accont has no ');
        }
        return this._signer.sign(message, this.address.toString(), this._connection.chainId);
    }
    /**
     *
     * @param tx
     */
    async signTx(tx) {
        return this._signer.signTransaction(tx, this.address.toString(), this._connection.chainId);
    }
    /**
     *  Sign transaction and send to node
     * @return string Transaction hash
     * @param tx
     */
    async signAndSendTx(tx) {
        const signedTx = await this.signTx(tx);
        return this._connection.provider.sendTransaction({ tx: signedTx.toString() }).then(res => res.hash);
    }
}
exports.Account = Account;
