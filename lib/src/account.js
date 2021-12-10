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
 *
 */
class Account {
    constructor(keyPair, connection) {
        this.publicKey = keyPair.publicKey();
        this.address = this.publicKey.address();
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
    async state() {
        const address = this.address.toString();
        return this._connection.provider.address({ address });
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
        const signedTx = this._signer.signTransaction(tx, this.address.toString(), this._connection.chainId);
        return this._connection.provider.sendTransaction({ tx: signedTx.toString() }).then(res => res.hash);
    }
}
exports.Account = Account;
