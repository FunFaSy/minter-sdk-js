/// <reference types="node" />
import { ECDSASignatureBuffer } from '../util';
import { PublicKey, Signature } from '../key_pair';
export declare enum SignatureType {
    Single = 1,
    Multi = 2
}
/**
 *
 */
export declare abstract class TransactionSignature extends Signature {
    constructor();
    abstract getRaw(): Buffer[];
    abstract serialize(): Buffer;
}
/**
 *
 */
export declare class SingleSignature extends TransactionSignature {
    protected raw: Buffer[];
    /**
     *
     * @param data RLP encoded ECDSASignatureBuffer [v,r,s] or object type ECDSASignatureBuffer
     */
    constructor(data: Buffer | ECDSASignatureBuffer);
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
    publicKey(txHash: Buffer): PublicKey;
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
export declare class MultiSignature extends TransactionSignature {
    multisig: Buffer;
    signatures: Buffer[];
    protected raw: Buffer[];
    protected _signatures: SingleSignature[];
    /**
     *
     * @param data RLP encoded multisig data
     */
    constructor(data: Buffer | {
        multisig: Buffer;
        signatures: Buffer[];
    });
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
    addOne(signature: SingleSignature): MultiSignature;
    /**
     *
     * @param multisig
     */
    setMultisig(multisig: Buffer): void;
}
