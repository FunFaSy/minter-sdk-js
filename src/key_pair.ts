import {
    assertIsBuffer,
    assertIsString,
    Assignable,
    base_decode,
    base_encode,
    bufferToInt,
    ECDSASignatureBuffer,
    ecrecover,
    ecsign,
    ethIsValidPublic,
    ethPrivateToPublic,
    ethPublicToAddress,
    fromRpcSig,
    isString,
    MinterPrefix,
    secp256k1, sha256,
    toBuffer,
    toRpcSig,
} from './util';

export type Arrayish = string | ArrayLike<number>;

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
export const secp256k1PublicKeyFromMessage = (message: Buffer, signature: Buffer[]): Buffer => {
    assertIsBuffer(signature[0]);
    assertIsBuffer(signature[1]);
    assertIsBuffer(signature[2]);

    const bufV: Buffer = signature[0];
    const bufR: Buffer = signature[1];
    const bufS: Buffer = signature[2];

    try {
        const v = bufferToInt(bufV);
        // ecrecover throw error in case invalid signature
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
    abstract sign(message: Buffer): Signature;

    /**
     *
     * @param message   Buffer Sha256 hash of `message`
     * @param signature Buffer[]
     */
    abstract verify(message: Buffer, signature: Buffer[]): boolean;

    toString(): string {
        return `${keyType2Str(this._publicKey.keyType)}:${base_encode(this._secretKey)}`;
    }

    address(): Address {
        return this._publicKey.address();
    }

    publicKey(): PublicKey {
        return this._publicKey;
    }

    /**
     * @param curve Name of elliptical curve, case-insensitive
     * @returns Random KeyPair based on the curve
     */
    static fromRandom(curve: KeyType | string): KeyPair {
        let _curve = KeyType.SECP256K1;
        if (!curve) {
            if (isString(curve)) {
                _curve = str2KeyType(curve.toString());
            } else {
                _curve = curve as KeyType;
            }
        }

        switch (_curve) {
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

        super(new PublicKey({keyType: KeyType.SECP256K1, raw: publicKey}), _secretKey);
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
     * Sign message and return ECDSASignature
     *
     * @param message Buffer Sha256 hash of `message`
     */
    sign(message: Buffer): Signature {
        assertIsBuffer(message);

        const vrsSig = ecsign(message, this._secretKey);
        return  new Signature(toBuffer(vrsSig.v), vrsSig.r, vrsSig.s);
    }

    /**
     * Check if message signed by current key pair
     *
     * @param message Sha256 hash of `message`
     * @param signature Buffer [v,r,s] from Ethereum ECDSASignature
     */
    verify(message: Buffer, signature: Buffer[]): boolean {
        return this._publicKey.verify(message, signature);
    }
}

/**
 * PublicKey representation that has type and bytes of the key.
 */
export class PublicKey extends Assignable {
    keyType: KeyType;
    protected raw: Buffer;
    protected _address: Address;

    constructor(properties: any) {
        super(properties);

        if (0 < this.raw.length) {
            this._address = Address.fromPublicKey(this);
        }
    }

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
            return new PublicKey({keyType: KeyType.SECP256K1, raw: base_decode(parts[0])});
        }
        //
        else if (parts.length === 2) {
            return new PublicKey({keyType: str2KeyType(parts[0]), raw: base_decode(parts[1])});
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
        return `${keyType2Str(this.keyType)}:${base_encode(this.raw)}`;
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
            return publicKey && this.raw.equals(publicKey as Buffer);
        }
        //
        default:
            throw new Error(`Unknown key type ${this.keyType}`);
        }
    }

    /**
     *
     */
    getRaw(): Buffer {return Buffer.from(this.raw);}// Copy of pub key

    /**
     *
     */
    address(): Address {
        if (this._address instanceof Address) {
            return this._address;
        }

        if (0 < this.raw.length) {
            this._address = Address.fromPublicKey(this);
        }

        return this._address;
    }
}

/**
 *
 */
export class Address extends Assignable {
    protected publicKey: PublicKey;
    protected address: Buffer;


    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    static fromPublicKey(publicKey: PublicKey): Address {
        return new Address({
            publicKey: publicKey,
            address  : ethPublicToAddress(publicKey.getRaw()),
        });
    }

    getRaw(): Buffer{
        return this.address;
    }

    toString(): string {
        return `${MinterPrefix.ADDRESS}${this.address.toString('hex')}`;
    }
}

/**
 *
 */
export class Signature implements ECDSASignatureBuffer {
    type: string;

    constructor(public v: Buffer, public r: Buffer, public s: Buffer) {
        this.type = 'ECDSA';
    }

    /**
     *
     */
    toString(): string {
        const ethRpcSig = toRpcSig(this.v, this.r, this.s); // 0x prefixed Hex string
        return `${this.type}:${ethRpcSig}`;
    }

    /**
     * Determines if the signature is valid ECDSA signature
     */
    valid(): boolean {
        const message = sha256(Buffer.from([]));
        return ethIsValidPublic(secp256k1PublicKeyFromMessage(message, [this.v, this.r, this.s]));
    }


    /**
     *
     * @param signature string
     */
    static fromString(signature: string): Signature {
        assertIsString(signature);

        const parts = signature.split(':');
        if (parts.length === 1) {
            const ethRpcSig = parts[0];// Buffer encoded 0x Prefixed Hex
            const vrsSig = fromRpcSig(ethRpcSig.toString());
            return new Signature(toBuffer(vrsSig.v), vrsSig.r, vrsSig.s);
        }
        //
        else if (parts.length === 2) {
            const type = parts[0];

            switch (type) {
            case 'ECDSA': {
                return Signature.fromString(parts[1]);
            }
            default:
                throw new Error(`Unknown signature type: ${type}`);
            }
        }
        //
        else {
            throw new Error('Invalid encoded signature format, must be <curve>:<encoded sig>');
        }
    }

}
