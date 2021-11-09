'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
exports.Address = exports.PublicKey = exports.KeyPairSecp256k1 = exports.KeyPairEd25519 = exports.KeyPair = exports.KeyType = void 0;
const serialize_1 = require('../util/functions/serialize');
const types_1 = require('../util/types');
const util_1 = require('../util');
const external_1 = require('../util/external');
/** All supported key types */
var KeyType;
(function(KeyType) {
    KeyType[KeyType['SECP256K1'] = 0] = 'SECP256K1';
    KeyType[KeyType['ED25519'] = 1] = 'ED25519';
})(KeyType = exports.KeyType || (exports.KeyType = {}));

function keyType2Str(keyType) {
    switch (keyType) {
        case KeyType.SECP256K1:
            return 'secp256k1';
        case KeyType.ED25519:
            return 'ed25519';
        default:
            throw new Error(`Unknown key type ${keyType}`);
    }
}

function str2KeyType(keyType) {
    switch (keyType.toLowerCase()) {
        case 'ed25519':
            return KeyType.ED25519;
        case 'secp256k1':
            return KeyType.SECP256K1;
        default:
            throw new Error(`Unknown key type ${keyType}`);
    }
}

class KeyPair {
    constructor(publicKey, secretKey) {
        this.publicKey = publicKey;
        this.secretKey = secretKey;
    }

    /**
     * @param curve Name of elliptical curve, case-insensitive
     * @returns Random KeyPair based on the curve
     */
    static fromRandom(curve) {
        switch (str2KeyType(curve.toString())) {
            case KeyType.SECP256K1:
                return KeyPairSecp256k1.fromRandom();
            case KeyType.ED25519:
                return KeyPairEd25519.fromRandom();
            default:
                throw new Error(`Unknown curve ${curve}`);
        }
    }

    static fromString(encodedKey) {
        const parts = encodedKey.split(':');
        if (parts.length === 1) {
            return new KeyPairSecp256k1(parts[0]);
        } else if (parts.length === 2) {
            switch (str2KeyType(parts[0])) {
                case KeyType.SECP256K1:
                    return new KeyPairSecp256k1(parts[1]);
                case KeyType.ED25519:
                    return new KeyPairEd25519(parts[1]);
                default:
                    throw new Error(`Unknown curve: ${parts[0]}`);
            }
        } else {
            throw new Error(
                'Invalid encoded key format, must be <curve>:<encoded key>');
        }
    }

    toString() {
        return `${keyType2Str(this.publicKey.keyType)}:${this.secretKey}`;
    }

    getPublicKey() {
        return this.publicKey;
    }
}

exports.KeyPair = KeyPair;

/**
 * This class provides key pair functionality for Ed25519 curve:
 * generating key pairs, encoding key pairs, signing and verifying.
 */
class KeyPairEd25519 extends KeyPair {
    /**
     * Construct an instance of key pair given a secret key.
     * It's generally assumed that these are encoded in base58check.
     * @param {string} secretKey
     */
    constructor(secretKey) {
        const keyPair = external_1.nacl.sign.keyPair.fromSecretKey(
            serialize_1.base_decode(secretKey));
        super(
            new PublicKey({keyType: KeyType.ED25519, data: keyPair.publicKey}),
            secretKey);
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
    static fromRandom() {
        const newKeyPair = external_1.nacl.sign.keyPair();
        return new KeyPairEd25519(
            serialize_1.base_encode(newKeyPair.secretKey));
    }

    sign(message) {
        const signature = util_1.toBuffer(external_1.nacl.sign.detached(message,
            serialize_1.base_decode(this.secretKey)));
        return {signature, publicKey: this.publicKey};
    }

    verify(message, signature) {
        return this.publicKey.verify(message, signature);
    }
}

exports.KeyPairEd25519 = KeyPairEd25519;

/**
 * This class provides key pair functionality for Secp256k1 curve:
 * generating key pairs, encoding key pairs, signing and verifying.
 */
class KeyPairSecp256k1 extends KeyPair {
    /**
     * Construct an instance of key pair given a secret key.
     * It's generally assumed that these are encoded in base58check.
     * @param {string} secretKey
     */
    constructor(secretKey) {
        const publicKey = util_1.ethPrivateToPublic(
            serialize_1.base_decode(secretKey));
        super(new PublicKey({keyType: KeyType.SECP256K1, data: publicKey}),
            secretKey);
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
    static fromRandom() {
        const secretKey = external_1.secp256k1.createPrivateKeySync();
        return new KeyPairSecp256k1(serialize_1.base_encode(secretKey));
    }

    sign(message) {
        const signature = external_1.secp256k1Shim.sign(message,
            serialize_1.base_decode(this.secretKey)).signature;
        return {signature, publicKey: this.publicKey};
    }

    verify(message, signature) {
        return this.publicKey.verify(message, signature);
    }
}

exports.KeyPairSecp256k1 = KeyPairSecp256k1;

/**
 * PublicKey representation that has type and bytes of the key.
 */
class PublicKey extends types_1.Assignable {
    static from(value) {
        if (typeof value === 'string') {
            return PublicKey.fromString(value);
        }
        return value;
    }

    /**
     * It's generally assumed that these are encoded in base58check.
     * @param {string} encodedKey
     */
    static fromString(encodedKey) {
        const parts = encodedKey.split(':');
        if (parts.length === 1) {
            return new PublicKey({
                keyType: KeyType.SECP256K1,
                data   : serialize_1.base_decode(parts[0]),
            });
        } else if (parts.length === 2) {
            return new PublicKey({
                keyType: str2KeyType(parts[0]),
                data   : serialize_1.base_decode(parts[1]),
            });
        } else {
            throw new Error(
                'Invalid encoded key format, must be <curve>:<encoded key>');
        }
    }

    toString() {
        return `${keyType2Str(this.keyType)}:${serialize_1.base_encode(
            this.data)}`;
    }

    verify(message, signature) {
        switch (this.keyType) {
            case KeyType.ED25519:
                return external_1.nacl.sign.detached.verify(message, signature,
                    this.data);
            case KeyType.SECP256K1:
                return external_1.secp256k1Shim.verify(message, signature,
                    this.data);
            default:
                throw new Error(`Unknown key type ${this.keyType}`);
        }
    }

    getAddress() {
        if (!(this.address instanceof Address)) {
            this.address = Address.fromPublicKey(this);
        }
        return this.address;
    }
}

exports.PublicKey = PublicKey;

/**
 *
 */
class Address extends types_1.Assignable {
    static fromPublicKey(publicKey) {
        return new Address(
            {publicKey, data: util_1.ethPublicToAddress(publicKey.data)});
    }

    toString() {
        return `${util_1.Prefix.ADDRESS}${this.data.toString('hex')}`;
    }

    getPublicKey() {
        return this.publicKey;
    }
}

exports.Address = Address;
