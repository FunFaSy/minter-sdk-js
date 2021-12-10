/// <reference types="node" />
import { ECDSASignatureBuffer } from '../util';
import { PublicKey, Signature } from '../key_pair';
import { Transaction } from './transaction';
export declare enum TxSignatureType {
    Single = 1,
    Multi = 2
}
/**
 *
 */
export declare abstract class TransactionSignature extends Signature {
    protected raw: Buffer[];
    protected transaction: Transaction;
    constructor(tx?: Transaction);
    abstract getRaw(): Buffer[];
    abstract serialize(): Buffer;
    abstract publicKey(txHash: Buffer): PublicKey[];
}
/**
 *
 */
export declare class TxSingleSignature extends TransactionSignature {
    /**
     *
     * @param data RLP encoded ECDSASignatureBuffer [v,r,s] or object type ECDSASignatureBuffer
     * @param tx
     */
    constructor(data: Buffer | ECDSASignatureBuffer, tx?: Transaction);
    static fromString(signature: string): TxSingleSignature;
    /**
     * Determines if the message signed given public key
     *
     * @param txHash SHA256 transaction hash without signatureData field
     * @param rlpVrs RLP encoded ECDSA signature [v,r,s]
     * @param publicKey
     */
    static assertSignature(txHash: Buffer, rlpVrs: Buffer, publicKey: string): boolean;
    /**
     *
     */
    getRaw(): Buffer[];
    /**
     *  Determines if the signature is valid ECDSA signature
     */
    valid(): boolean;
    /**
     * Return singer public key for txHash
     * @param txHash
     */
    publicKey(txHash: Buffer): PublicKey[];
    /**
     * RLP Encode Signature
     */
    serialize(): Buffer;
    private _validateV;
    private _overrideVSetterWithValidation;
}
/**
 *
 */
export declare class TxMultiSignature extends TransactionSignature {
    multisig: Buffer;
    signatures: Buffer[];
    protected raw: Buffer[];
    protected _signatures: Map<string, TxSingleSignature>;
    /**
     *
     * @param data RLP encoded multisig data
     * @param tx
     */
    constructor(data: Buffer | {
        multisig: Buffer;
        signatures: Buffer[];
    }, tx?: Transaction);
    static fromString(signature: string): TxMultiSignature;
    /**
     *
     */
    getRaw(): Buffer[];
    /**
     *
     */
    valid(): boolean;
    /**
     * Return singers public key for txHash
     * @param txHash
     */
    publicKey(txHash: Buffer): PublicKey[];
    /**
     * @return RLP Encoded Signature
     */
    serialize(): Buffer;
    /**
     *
     * @param signature
     */
    addOne(signature: TxSingleSignature): TxMultiSignature;
    /**
     *
     * @param multisig
     */
    setMultisig(multisig: Buffer): TxMultiSignature;
}
