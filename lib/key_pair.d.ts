/// <reference types="node" />
import { Assignable, ECDSASignatureBuffer } from './util';
export declare type Arrayish = string | ArrayLike<number>;
/** All supported key types */
export declare enum KeyType {
    UNKNOWN = "UNKNOWN",
    SECP256K1 = "SECP256K1",
    ED25519 = "ED25519"
}
export declare abstract class KeyPair {
    readonly _keyType: KeyType;
    readonly _secretKey: Buffer;
    constructor(secretKey: Buffer, type?: KeyType);
    abstract get publicKey(): PublicKey;
    get type(): KeyType;
    get address(): Address;
    /**
     * @param curve Name of elliptical curve, case-insensitive
     * @returns Random KeyPair based on the curve
     */
    static fromRandom(curve?: KeyType | string): KeyPair;
    /**
     * Construct an instance of key pair given a secret key.
     * It's generally assumed that these are encoded in base58check.
     * @param secretKey
     */
    static fromString(secretKey: string): KeyPair;
    /**
     *
     * @param message Sha256 hash of `message`
     */
    abstract sign(message: Buffer): Signature;
    /**
     *
     * @param message   Buffer Sha256 hash of `message`
     * @param signature Buffer[]
     */
    abstract verify(message: Buffer, signature: Buffer[]): boolean;
    toString(): string;
}
/**
 * This class provides key pair functionality for Secp256k1 curve:
 * generating key pairs, encoding key pairs, signing and verifying.
 */
export declare class KeyPairSecp256k1 extends KeyPair {
    /**
     * Construct an instance of key pair given a secret key.
     * It's generally assumed that these are encoded in base58check.
     * @param {string} secretKey
     */
    constructor(secretKey: string);
    protected _publicKey: PublicKey;
    get publicKey(): PublicKey;
    /**
     * Generate a new random secp256k1 keypair.
     * @example
     * ```js
     * ```
     */
    static fromRandom(): KeyPair;
    /**
     * Sign message and return ECDSASignature
     *
     * @param message Buffer Sha256 hash of `message`
     */
    sign(message: Buffer): Signature;
    /**
     * Check if message signed by current key pair
     *
     * @param message Sha256 hash of `message`
     * @param signature Buffer [v,r,s] from Ethereum ECDSASignature
     */
    verify(message: Buffer, signature: Buffer[]): boolean;
}
/**
 * PublicKey representation that has type and bytes of the key.
 */
export declare class PublicKey extends Assignable {
    keyType: KeyType;
    protected raw: Buffer;
    constructor(properties: any);
    protected _address: Address;
    /**
     *
     */
    get address(): Address;
    static from(value: string | Buffer | PublicKey): PublicKey;
    /**
     * It's generally assumed that these are encoded in base58check.
     * @param {string} encodedKey
     */
    static fromString(encodedKey: string): PublicKey;
    static fromBuffer(buf: Buffer): PublicKey;
    /**
     *
     * @param message
     * @param signature
     */
    static fromMessageBuf(message: Buffer, signature: Buffer[]): PublicKey;
    /**
     *
     */
    toString(): string;
    /**
     * Check if message signed by current public key owner
     *
     * @param message Sha256 hash of `message`
     * @param signature Buffer [v,r,s] from Ethereum ECDSASignature
     */
    verify(message: Buffer, signature: Buffer[]): boolean;
    /**
     *
     */
    getRaw(): Buffer;
}
/**
 *
 */
export declare class Address extends Assignable {
    protected publicKey: PublicKey;
    protected raw: Buffer;
    static fromPublicKey(publicKey: PublicKey): Address;
    getRaw(): Buffer;
    toString(): string;
}
/**
 *
 */
export declare class Signature implements ECDSASignatureBuffer {
    v: Buffer;
    r: Buffer;
    s: Buffer;
    type: string;
    constructor(v: Buffer, r: Buffer, s: Buffer);
    /**
     *
     * @param signature string
     */
    static fromString(signature: string): Signature;
    getRaw(): Buffer[];
    /**
     *
     */
    toString(): string;
    /**
     * Determines if the signature is valid ECDSA signature
     */
    valid(): boolean;
}
