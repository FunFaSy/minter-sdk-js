import {
    assertIsBuffer,
    assertIsString,
    Assignable,
    base_decode,
    base_encode,
    bufferToInt,
    ecrecover,
    ecsign,
    ethPrivateToPublic,
    ethPublicToAddress,
    fromRpcSig,
    MinterPrefix,
    secp256k1,
    toBuffer,
    toRpcSig,
} from './util';
import {BN} from './util/external';

export type Arrayish = string | ArrayLike<number>;

/**
 *
 */
export class KeyPairSignature extends Assignable {
    signature: Buffer[];
    keyType: KeyType;

    raw(): Buffer[] { return this.signature;}

    /**
     *
     */
    toString(): string {
        const ethRpcSig = toRpcSig(this.signature[0], this.signature[1], this.signature[2]); // 0x prefixed Hex string
        return `${keyType2Str(this.keyType)}:${base_encode(ethRpcSig)}`;
    }

    /**
     *
     * @param signature string
     */
    static fromString(signature: string): KeyPairSignature {
        assertIsString(signature);

        const parts = signature.split(':');
        if (parts.length === 1) {
            const ethRpcSig = base_decode(parts[0]);// Buffer encoded 0x Prefixed Hex
            const vrsSig = fromRpcSig(ethRpcSig.toString());
            return new KeyPairSignature({
                keyType  : KeyType.SECP256K1,
                signature: [toBuffer(vrsSig.v), vrsSig.r, vrsSig.s],
            });
        }
        //
        else if (parts.length === 2) {
            const keyType = str2KeyType(parts[0]);

            switch (keyType) {
            case KeyType.SECP256K1: {
                const ethRpcSig = base_decode(parts[1]);// Buffer encoded 0x Prefixed Hex
                const vrsSig = fromRpcSig(ethRpcSig.toString()); // 0x Prefixed Hex
                return new KeyPairSignature({
                    keyType  : KeyType.SECP256K1,
                    signature: [toBuffer(vrsSig.v), vrsSig.r, vrsSig.s],
                });
            }
            default:
                throw new Error(`Unknown curve: ${parts[0]}`);
            }
        }
        //
        else {
            throw new Error('Invalid encoded signature format, must be <curve>:<encoded sig>');
        }
    }
}

/** All supported key types */
export enum KeyType {
    SECP256K1 = 0, // ECDSA
    ED25519   = 1, // EdDSA
}

const keyType2Str = (keyType: KeyType): string => {
    switch (keyType) {
    case KeyType.SECP256K1:
        return 'secp256k1';
    case KeyType.ED25519:
        return 'ed25519';
    default:
        throw new Error(`Unknown key type ${keyType}`);
    }
};

const str2KeyType = (keyType: string): KeyType => {
    switch (keyType.toLowerCase()) {
    case 'ed25519':
        return KeyType.ED25519;
    case 'secp256k1':
        return KeyType.SECP256K1;
    default:
        throw new Error(`Unknown key type ${keyType}`);
    }
};

/**
 *
 * @param message
 * @param signature
 */
const secp256k1PublicKeyFromMessage = (message: Buffer, signature: Buffer[]): Buffer => {
    assertIsBuffer(signature[0]);
    assertIsBuffer(signature[1]);
    assertIsBuffer(signature[2]);

    // secp256k1n/2
    const N_DIV_2 = new BN('7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0', 16);

    const bufV: Buffer = signature[0];
    const bufR: Buffer = signature[1];
    const bufS: Buffer = signature[2];

    // All transaction signatures whose s-value is greater than secp256k1n/2 are considered invalid.
    if (new BN(bufS).cmp(N_DIV_2) === 1) {
        return Buffer.from([]);
    }

    try {
        const v = bufferToInt(bufV);
        return ecrecover(message, v, bufR, bufS);
    }
    catch (error) {
        return Buffer.from([]);
    }

};

export abstract class KeyPair {
    readonly _publicKey: PublicKey;
    readonly _secretKey: Buffer;

    constructor(publicKey: PublicKey, secretKey: Buffer) {
        this._publicKey = publicKey;
        this._secretKey = secretKey;
    }

    /**
     *
     * @param message Sha256 hash of `message`
     */
    abstract sign(message: Buffer): KeyPairSignature;

    /**
     *
     * @param message   Buffer Sha256 hash of `message`
     * @param signature Buffer[]
     */
    abstract verify(message: Buffer, signature: Buffer[]): boolean;

    toString(): string {
        return `${keyType2Str(this._publicKey.keyType)}:${this._secretKey}`;
    }

    publicKey(): PublicKey {
        return this._publicKey;
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
        }
        //
        else if (parts.length === 2) {
            switch (str2KeyType(parts[0])) {
            case KeyType.SECP256K1:
                return new KeyPairSecp256k1(parts[1]);
                // case KeyType.ED25519:
                //     return new KeyPairEd25519(parts[1]);
            default:
                throw new Error(`Unknown curve: ${parts[0]}`);
            }
        }
        //
        else {
            throw new Error(
                'Invalid encoded key format, must be <curve>:<encoded key>');
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
        assertIsString(secretKey);

        const _secretKey = base_decode(secretKey);
        const publicKey = ethPrivateToPublic(_secretKey);

        super(new PublicKey({keyType: KeyType.SECP256K1, _publicKey: publicKey}), _secretKey);
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

    /**
     * Ethereum like signing method to make ECDSASignature
     *
     * @param message Buffer Sha256 hash of `message`
     */
    sign(message: Buffer): KeyPairSignature {
        assertIsBuffer(message);

        const vrsSig = ecsign(message, this._secretKey);

        return new KeyPairSignature(
            {signature: [toBuffer(vrsSig.v), vrsSig.r, vrsSig.s], keyType: this._publicKey.keyType});
    }

    /**
     * Check if signature for message hash is valid
     *
     * @param message Sha256 hash of `message`
     * @param signature Buffer [v,r,s] from Ethereum ECDSASignature
     */
    verify(message: Buffer, signature: Buffer[]): boolean {
        return !!secp256k1PublicKeyFromMessage(message, signature);
    }
}

/**
 * PublicKey representation that has type and bytes of the key.
 */
export class PublicKey extends Assignable {
    keyType: KeyType;
    protected _publicKey: Buffer;
    protected _address: PublicKeyAddress;

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
        assertIsString(encodedKey);

        const parts = encodedKey.split(':');
        if (parts.length === 1) {
            return new PublicKey({keyType: KeyType.SECP256K1, _publicKey: base_decode(parts[0])});
        }
        //
        else if (parts.length === 2) {
            return new PublicKey({keyType: str2KeyType(parts[0]), _publicKey: base_decode(parts[1])});
        }
        //
        else {
            throw new Error('Invalid encoded key format, must be <curve>:<encoded key>');
        }
    }

    /**
     *
     */
    toString(): string {
        return `${keyType2Str(this.keyType)}:${base_encode(this._publicKey)}`;
    }

    /**
     * Check if message signed by current public key owner
     *
     * @param message Sha256 hash of `message`
     * @param signature Buffer [v,r,s] from Ethereum ECDSASignature
     */
    verify(message: Buffer, signature: Buffer[]): boolean {
        switch (this.keyType) {
        // case KeyType.ED25519:
        //     return nacl.sign.detached.verify(message, signature, this.data);
        case KeyType.SECP256K1: {
            const publicKey = secp256k1PublicKeyFromMessage(message, signature);
            return publicKey && this._publicKey.equals(publicKey);
        }
        //
        default:
            throw new Error(`Unknown key type ${this.keyType}`);
        }
    }

    /**
     *
     */
    raw(): Buffer {return Buffer.from(this._publicKey);}

    /**
     *
     */
    address(): PublicKeyAddress {
        if (this._address instanceof PublicKeyAddress) {
            return this._address;
        }

        this._address = PublicKeyAddress.fromPublicKey(this);

        return this._address;
    }
}

/**
 *
 */
export class PublicKeyAddress extends Assignable {
    protected publicKey: PublicKey;
    protected address: Buffer;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    static fromPublicKey(publicKey: PublicKey): PublicKeyAddress {
        return new PublicKeyAddress({
            publicKey: publicKey,
            address  : ethPublicToAddress(publicKey.raw()),
        });
    }

    toString(): string {
        return `${MinterPrefix.ADDRESS}${this.address.toString('hex')}`;
    }
}
