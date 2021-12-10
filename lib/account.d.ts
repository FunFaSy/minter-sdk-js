/** @module */
/// <reference types="node" />
import { Connection } from './connection';
import { Address, KeyPair, PublicKey, Signature } from './key_pair';
import { KeyStore } from './key_stores';
import { Signer } from './signer';
import { SignedTransaction, Transaction } from './transaction/transaction';
import { Coin } from './providers/internal';
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
/**
 * This class provides common account related RPC calls including signing transactions with a {@link KeyPair}.
 *
 * @example {@link }
 * @hint Use {@link Wallet} in the browser to manage derivited Accounts.
 * @see {@link }
 */
export declare class Account {
    readonly publicKey: PublicKey;
    readonly address: Address;
    protected _keyStore: KeyStore;
    protected _signer: Signer;
    protected _connection: Connection;
    constructor(keyPair: KeyPair, connection: Connection);
    setKeyStore(keyStore: KeyStore): Promise<Account>;
    setConnection(connection: Connection): Promise<Account>;
    nonce(): Promise<number>;
    state(): Promise<AccountState>;
    /**
     *
     * @param message
     */
    sign(message: Buffer): Promise<Signature>;
    /**
     *
     * @param tx
     */
    signTx(tx: Transaction): Promise<SignedTransaction>;
    /**
     *  Sign transaction and send to node
     * @return string Transaction hash
     * @param tx
     */
    signAndSendTx(tx: Transaction): Promise<string>;
}
