import {
    Assignable,
    base_decode,
    base_encode,
    ethPrivateToPublic,
    ethPublicToAddress,
    Prefix,
    secp256k1,
    secp256k1Shim,
} from './util';

export type Arrayish = string | ArrayLike<number>;

export interface Signature {
    signature: Buffer;
    publicKey: PublicKey;
}

/** All supported key types */
export enum KeyType {
    SECP256K1 = 0, // ECDSA
    ED25519   = 1, // EdDSA
}

function keyType2Str(keyType: KeyType): string {
    switch (keyType) {
    case KeyType.SECP256K1:
        return 'secp256k1';
    case KeyType.ED25519:
        return 'ed25519';
    default:
        throw new Error(`Unknown key type ${keyType}`);
    }
}

function str2KeyType(keyType: string): KeyType {
    switch (keyType.toLowerCase()) {
    case 'ed25519':
        return KeyType.ED25519;
    case 'secp256k1':
        return KeyType.SECP256K1;
    default:
        throw new Error(`Unknown key type ${keyType}`);
    }
}

export abstract class KeyPair {
    readonly publicKey: PublicKey;
    readonly secretKey: string;

    constructor(publicKey: PublicKey, secretKey: string) {
        this.publicKey = publicKey;
        this.secretKey = secretKey;
    }

    abstract sign(message: Buffer): Signature;

    abstract verify(message: Buffer, signature: Buffer): boolean;

    toString(): string {
        return `${keyType2Str(this.publicKey.keyType)}:${this.secretKey}`;
    }

    getPublicKey(): PublicKey {
        return this.publicKey;
    }

    /**
     * @param curve Name of elliptical curve, case-insensitive
     * @returns Random KeyPair based on the curve
     */
    static fromRandom(curve: KeyType | string): KeyPair {
        switch (str2KeyType(curve.toString())) {
        case KeyType.SECP256K1:
            return KeyPairSecp256k1.fromRandom();
        // case KeyType.ED25519:
        //     return KeyPairEd25519.fromRandom();
        default:
            throw new Error(`Unknown curve ${curve}`);
        }
    }

    static fromString(encodedKey: string): KeyPair {
        const parts = encodedKey.split(':');
        if (parts.length === 1) {
            return new KeyPairSecp256k1(parts[0]);
        } else if (parts.length === 2) {
            switch (str2KeyType(parts[0])) {
            case KeyType.SECP256K1:
                return new KeyPairSecp256k1(parts[1]);
            // case KeyType.ED25519:
            //     return new KeyPairEd25519(parts[1]);
            default:
                throw new Error(`Unknown curve: ${parts[0]}`);
            }
        } else {
            throw new Error('Invalid encoded key format, must be <curve>:<encoded key>');
        }
    }
}

/**
 * This class provides key pair functionality for Ed25519 curve:
 * generating key pairs, encoding key pairs, signing and verifying.
 */
// export class KeyPairEd25519 extends KeyPair {
//     /**
//      * Construct an instance of key pair given a secret key.
//      * It's generally assumed that these are encoded in base58check.
//      * @param {string} secretKey
//      */
//     constructor(secretKey: string) {
//         const keyPair = nacl.sign.keyPair.fromSecretKey(base_decode(secretKey));
//         super(new PublicKey({keyType: KeyType.ED25519, data: keyPair.publicKey}), secretKey);
//     }
//
//     /**
//      * Generate a new random keypair.
//      * @example
//      * const keyRandom = KeyPair.fromRandom();
//      * keyRandom.publicKey
//      * // returns [PUBLIC_KEY]
//      *
//      * keyRandom.secretKey
//      * // returns [SECRET_KEY]
//      */
//     static fromRandom(): KeyPair {
//         const newKeyPair = nacl.sign.keyPair();
//         return new KeyPairEd25519(base_encode(newKeyPair.secretKey));
//     }
//
//     sign(message: Buffer): Signature {
//         const signature = toBuffer(nacl.sign.detached(message, base_decode(this.secretKey)));
//         return {signature, publicKey: this.publicKey};
//     }
//
//     verify(message: Buffer, signature: Buffer): boolean {
//         return this.publicKey.verify(message, signature);
//     }
//
// }

/**
 * This class provides key pair functionality for Secp256k1 curve:
 * generating key pairs, encoding key pairs, signing and verifying.
 */
export class KeyPairSecp256k1 extends KeyPair {
    /**
     * Construct an instance of key pair given a secret key.
     * It's generally assumed that these are encoded in base58check.
     * @param {string} secretKey
     */
    constructor(secretKey: string) {
        const publicKey = ethPrivateToPublic(base_decode(secretKey));
        super(new PublicKey({keyType: KeyType.SECP256K1, data: publicKey}), secretKey);
    }

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
    static fromRandom(): KeyPair {
        const secretKey = secp256k1.createPrivateKeySync();
        return new KeyPairSecp256k1(base_encode(secretKey));
    }

    sign(message: Buffer): Signature {
        const signature = secp256k1Shim.sign(message, base_decode(this.secretKey)).signature;
        return {signature, publicKey: this.publicKey};
    }

    verify(message: Buffer, signature: Buffer): boolean {
        return this.publicKey.verify(message, signature);
    }
}

/**
 * PublicKey representation that has type and bytes of the key.
 */
export class PublicKey extends Assignable {
    keyType: KeyType;
    data: Buffer;
    protected address: Address;

    static from(value: string | PublicKey): PublicKey {
        if (typeof value === 'string') {
            return PublicKey.fromString(value);
        }
        return value;
    }

    /**
     * It's generally assumed that these are encoded in base58check.
     * @param {string} encodedKey
     */
    static fromString(encodedKey: string): PublicKey {
        const parts = encodedKey.split(':');
        if (parts.length === 1) {
            return new PublicKey({keyType: KeyType.SECP256K1, data: base_decode(parts[0])});
        } else if (parts.length === 2) {
            return new PublicKey({keyType: str2KeyType(parts[0]), data: base_decode(parts[1])});
        } else {
            throw new Error('Invalid encoded key format, must be <curve>:<encoded key>');
        }
    }

    toString(): string {
        return `${keyType2Str(this.keyType)}:${base_encode(this.data)}`;
    }

    verify(message: Buffer, signature: Buffer): boolean {
        switch (this.keyType) {
        // case KeyType.ED25519:
        //     return nacl.sign.detached.verify(message, signature, this.data);
        case KeyType.SECP256K1:
            return secp256k1Shim.verify(message, signature, this.data);
        default:
            throw new Error(`Unknown key type ${this.keyType}`);
        }
    }

    getAddress(): Address {
        if (!(this.address instanceof Address)) {
            this.address = Address.fromPublicKey(this);
        }
        return this.address;
    }
}

/**
 *
 */
export class Address extends Assignable {
    publicKey: PublicKey;
    data: Buffer;

    static fromPublicKey(publicKey: PublicKey): Address {
        return new Address({publicKey, data: ethPublicToAddress(publicKey.data)});
    }

    toString(): string {
        return `${Prefix.ADDRESS}${this.data.toString('hex')}`;
    }

    getPublicKey(): PublicKey {
        return this.publicKey;
    }
}
