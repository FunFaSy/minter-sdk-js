/// <reference types="node" />
import {Assignable} from '../util/types';

export declare type Arrayish = string | ArrayLike<number>;

export interface Signature {
    signature: Buffer;
    publicKey: PublicKey;
}

/** All supported key types */
export declare enum KeyType {
    SECP256K1 = 0,
    ED25519   = 1
}

export declare abstract class KeyPair {
    readonly publicKey: PublicKey;
    readonly secretKey: string;

    constructor(publicKey: PublicKey, secretKey: string);

    /**
     * @param curve Name of elliptical curve, case-insensitive
     * @returns Random KeyPair based on the curve
     */
    static fromRandom(curve: KeyType | string): KeyPair;

    static fromString(encodedKey: string): KeyPair;

    abstract sign(message: Buffer): Signature;

    abstract verify(message: Buffer, signature: Buffer): boolean;

    toString(): string;

    getPublicKey(): PublicKey;
}

/**
 * This class provides key pair functionality for Ed25519 curve:
 * generating key pairs, encoding key pairs, signing and verifying.
 */
export declare class KeyPairEd25519 extends KeyPair {
    /**
     * Construct an instance of key pair given a secret key.
     * It's generally assumed that these are encoded in base58check.
     * @param {string} secretKey
     */
    constructor(secretKey: string);

    /**
     * Generate a new random keypair.
     * @example
     * const keyRandom = KeyPair.fromRandom();
     * keyRandom.publicKey
     * // returns [PUBLIC_KEY]
     *
     * keyRandom.secretKey
     * // returns [SECRET_KEY]
     */
    static fromRandom(): KeyPair;

    sign(message: Buffer): Signature;

    verify(message: Buffer, signature: Buffer): boolean;
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

    /**
     * Generate a new random keypair.
     * @example
     * const keyRandom = KeyPair.fromRandom();
     * keyRandom.publicKey
     * // returns [PUBLIC_KEY]
     *
     * keyRandom.secretKey
     * // returns [SECRET_KEY]
     */
    static fromRandom(): KeyPair;

    sign(message: Buffer): Signature;

    verify(message: Buffer, signature: Buffer): boolean;
}

/**
 * PublicKey representation that has type and bytes of the key.
 */
export declare class PublicKey extends Assignable {
    keyType: KeyType;
    data: Buffer;
    protected address: Address;

    static from(value: string | PublicKey): PublicKey;

    /**
     * It's generally assumed that these are encoded in base58check.
     * @param {string} encodedKey
     */
    static fromString(encodedKey: string): PublicKey;

    toString(): string;

    verify(message: Buffer, signature: Buffer): boolean;

    getAddress(): Address;
}

/**
 *
 */
export declare class Address extends Assignable {
    publicKey: PublicKey;
    data: Buffer;

    static fromPublicKey(publicKey: PublicKey): Address;

    toString(): string;

    getPublicKey(): PublicKey;
}
