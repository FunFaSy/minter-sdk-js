/// <reference types="node" />
import { Assignable } from '../util';
import { RlpSchemaField } from '../util/define-properties';
import { Chain } from '../chain';
import { Address, KeyPair, PublicKey } from '../key_pair';
import { TxSignatureType, TransactionSignature, TransactionSignature as Signature } from './signature';
import { Action } from './action';
import { TransactionType } from './internal';
/**
 *
 */
export interface TransactionOptions {
    /**
     * A Chain object defining the chain a transaction belongs to.
     */
    chain?: Chain;
    /**
     * The chain of the transaction, default: 'mainnet'
     */
    chainId?: number | string;
}
export interface TransactionParams {
    nonce?: number;
    chainId?: number;
    gasPrice?: number;
    gasCoin?: number;
    type: TransactionType;
    data: Buffer;
    payload?: string;
    serviceData?: string;
    signatureType: TxSignatureType;
    signatureData?: Buffer;
}
/**
 * Minter transaction.
 */
export declare class Transaction {
    raw: Buffer[];
    nonce: Buffer;
    chainId: Buffer;
    gasPrice: Buffer;
    gasCoin: Buffer;
    type: Buffer;
    data: Buffer;
    payload: Buffer;
    serviceData: Buffer;
    signatureType: Buffer;
    signatureData: Buffer;
    signature: TransactionSignature;
    protected _from?: Address;
    protected _senderPublicKey?: PublicKey;
    protected _chain: Chain;
    protected _action: Action;
    constructor(data?: string | Buffer | TransactionParams, opts?: TransactionOptions);
    /**
     *
     */
    static rlpSchema(): RlpSchemaField[];
    isSignatureTypeSingle(): boolean;
    isSignatureTypeMulti(): boolean;
    getRaw(): Buffer[];
    /**
     * returns chain ID
     */
    getChainId(): number;
    /**
     * Returns the sender's address
     * @return {Address}
     */
    getSenderAddress(): Address;
    /**
     * returns the public key of the sender
     * @return {Buffer}
     */
    getSenderPublicKey(): PublicKey;
    getAction(): Action;
    /**
     * Computes a sha3-256 hash of the serialized tx
     * @param includeSignature - Whether or not to include the signature
     */
    hash(includeSignature?: boolean): Buffer;
    /**
     *
     * @param keyPair
     * @param multiSigAddress Mx or 0x prefixed string
     */
    sign(keyPair: KeyPair, multiSigAddress?: string): SignedTransaction;
    /**
     *
     * @param keyPair
     */
    signAsync(keyPair: KeyPair): Promise<SignedTransaction>;
    /**
     * Validates the signature and checks to see if it has enough gas.
     */
    validate(): boolean;
    validate(stringError: false): boolean;
    validate(stringError: true): string;
    /**
     * Determines if the signature is valid
     * Side effect - setting up _senderPublicKey field
     * @return {Boolean}
     */
    isValidSignature(): boolean;
    /**
     * Returns the rlp encoding of the transaction
     */
    serialize(): Buffer;
    /**
     * Returns the transaction in JSON format
     * @see {@link https://github.com/ethereumjs/ethereumjs-util/blob/master/docs/index.md#defineproperties|ethereumjs-util}
     */
    toJSON(labels?: boolean): {
        [key: string]: string;
    } | string[];
    /**
     *
     */
    isSigned(): boolean;
    getSignature(): Signature | undefined;
    toString(): string;
}
/**
 *
 */
export declare class SignedTransaction extends Assignable {
    transaction: Transaction;
    signature: TransactionSignature;
    static decode(bytes: Buffer): SignedTransaction;
    serialize(): Buffer;
    toString(): string;
}
