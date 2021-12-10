"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Signature = exports.Address = exports.PublicKey = exports.KeyPairSecp256k1 = exports.KeyPair = exports.KeyType = void 0;
const util_1 = require("./util");
/** All supported key types */
var KeyType;
(function (KeyType) {
    KeyType["UNKNOWN"] = "UNKNOWN";
    KeyType["SECP256K1"] = "SECP256K1";
    KeyType["ED25519"] = "ED25519";
})(KeyType = exports.KeyType || (exports.KeyType = {}));
const keyType2Str = (keyType) => {
    switch (keyType) {
        case KeyType.SECP256K1:
            return 'secp256k1';
        case KeyType.ED25519:
            return 'ed25519';
        default:
            throw new Error(`Unknown key type ${keyType}`);
    }
};
const str2KeyType = (keyType) => {
    switch (keyType.toLowerCase()) {
        case 'ed25519':
            return KeyType.ED25519;
        case 'secp256k1':
            return KeyType.SECP256K1;
        default:
            throw new Error(`Unknown key type ${keyType}`);
    }
};
class KeyPair {
    constructor(secretKey, type = KeyType.UNKNOWN) {
        this._secretKey = secretKey;
        this._keyType = type;
    }
    get type() {
        return this._keyType;
    }
    /**
     * @param curve Name of elliptical curve, case-insensitive
     * @returns Random KeyPair based on the curve
     */
    static fromRandom(curve = KeyType.SECP256K1) {
        let _curve = KeyType.SECP256K1;
        if (!curve) {
            if (util_1.isString(curve)) {
                _curve = str2KeyType(curve.toString());
            }
            else {
                _curve = curve;
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
    /**
     * Construct an instance of key pair given a secret key.
     * It's generally assumed that these are encoded in base58check.
     * @param secretKey
     */
    static fromString(secretKey) {
        const parts = secretKey.split(':');
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
            throw new Error('Invalid encoded key format, must be <curve>:<encoded key>');
        }
    }
    toString() {
        return `${keyType2Str(this.publicKey.keyType)}:${util_1.base_encode(this._secretKey)}`;
    }
    get address() {
        return this.publicKey.address;
    }
}
exports.KeyPair = KeyPair;
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
        util_1.assertIsString(secretKey);
        let _secretKey;
        const parts = secretKey.split(':');
        if (parts.length < 2) {
            _secretKey = util_1.base_decode(parts[0]);
        }
        else {
            _secretKey = util_1.base_decode(parts[1]);
        }
        super(_secretKey, KeyType.SECP256K1);
        const publicKey = util_1.ethPrivateToPublic(_secretKey);
        this._publicKey = new PublicKey({ keyType: KeyType.SECP256K1, raw: publicKey });
    }
    get publicKey() {
        return this._publicKey;
    }
    /**
     * Generate a new random secp256k1 keypair.
     * @example
     * ```js
     * ```
     */
    static fromRandom() {
        const secretKey = util_1.secp256k1.createPrivateKeySync();
        return new KeyPairSecp256k1(util_1.base_encode(secretKey));
    }
    /**
     * Sign message and return ECDSASignature
     *
     * @param message Buffer Sha256 hash of `message`
     */
    sign(message) {
        util_1.assertIsBuffer(message);
        const vrsSig = util_1.ecsign(message, this._secretKey);
        return new Signature(util_1.toBuffer(vrsSig.v), vrsSig.r, vrsSig.s);
    }
    /**
     * Check if message signed by current key pair
     *
     * @param message Sha256 hash of `message`
     * @param signature Buffer [v,r,s] from Ethereum ECDSASignature
     */
    verify(message, signature) {
        return this._publicKey.verify(message, signature);
    }
}
exports.KeyPairSecp256k1 = KeyPairSecp256k1;
/**
 * PublicKey representation that has type and bytes of the key.
 */
class PublicKey extends util_1.Assignable {
    constructor(properties) {
        super(properties);
        if (0 < this.raw.length) {
            this._address = Address.fromPublicKey(this);
        }
    }
    static from(value) {
        if (typeof value === 'string') {
            return PublicKey.fromString(value);
        }
        //
        else if (util_1.isBuffer(value)) {
            return PublicKey.fromBuffer(value);
        }
        return value;
    }
    /**
     * It's generally assumed that these are encoded in base58check.
     * @param {string} encodedKey
     */
    static fromString(encodedKey) {
        util_1.assertIsString(encodedKey);
        const parts = encodedKey.split(':');
        if (parts.length === 1) {
            return new PublicKey({ keyType: KeyType.SECP256K1, raw: util_1.base_decode(parts[0]) });
        }
        //
        else if (parts.length === 2) {
            return new PublicKey({ keyType: str2KeyType(parts[0]), raw: util_1.base_decode(parts[1]) });
        }
        //
        else {
            throw new Error('Invalid encoded key format, must be <curve>:<encoded key>');
        }
    }
    static fromBuffer(buf) {
        util_1.assertIsBuffer(buf);
        return new PublicKey({ keyType: KeyType.SECP256K1, raw: buf });
    }
    /**
     *
     * @param message
     * @param signature
     */
    static fromMessageBuf(message, signature) {
        util_1.assertIsBuffer(signature[0]);
        util_1.assertIsBuffer(signature[1]);
        util_1.assertIsBuffer(signature[2]);
        const bufV = signature[0];
        const bufR = signature[1];
        const bufS = signature[2];
        const v = util_1.bufferToInt(bufV);
        return PublicKey.fromBuffer(util_1.ecrecover(message, v, bufR, bufS));
    }
    /**
     *
     */
    toString() {
        // native Minter encoding `0x${this.raw.toString('hex')}`
        return `${keyType2Str(this.keyType)}:${util_1.base_encode(this.raw)}`;
    }
    /**
     * Check if message signed by current public key owner
     *
     * @param message Sha256 hash of `message`
     * @param signature Buffer [v,r,s] from Ethereum ECDSASignature
     */
    verify(message, signature) {
        switch (this.keyType) {
            // case KeyType.ED25519:
            //     return nacl.sign.detached.verify(message, signature, this.data);
            case KeyType.SECP256K1: {
                const msgPublicKey = PublicKey.fromMessageBuf(message, signature);
                return msgPublicKey && this.raw.equals(msgPublicKey.getRaw());
            }
            //
            default:
                throw new Error(`Unknown key type ${this.keyType}`);
        }
    }
    /**
     *
     */
    getRaw() { return Buffer.from(this.raw); } // Copy of pub key
    /**
     *
     */
    get address() {
        if (this._address instanceof Address) {
            return this._address;
        }
        if (0 < this.raw.length) {
            this._address = Address.fromPublicKey(this);
        }
        return this._address;
    }
}
exports.PublicKey = PublicKey;
/**
 *
 */
class Address extends util_1.Assignable {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    static fromPublicKey(publicKey) {
        return new Address({
            publicKey: publicKey,
            raw: util_1.ethPublicToAddress(publicKey.getRaw()),
        });
    }
    getRaw() {
        return this.raw;
    }
    toString() {
        return `${util_1.MinterPrefix.ADDRESS}${this.raw.toString('hex')}`;
    }
}
exports.Address = Address;
/**
 *
 */
class Signature {
    constructor(v, r, s) {
        this.v = v;
        this.r = r;
        this.s = s;
        this.type = 'ECDSA';
    }
    /**
     *
     * @param signature string
     */
    static fromString(signature) {
        util_1.assertIsString(signature);
        const parts = signature.split(':');
        if (parts.length === 1) {
            const encodedSig = parts[0]; // Buffer encoded 0x Prefixed Hex
            // const vrsSig = fromRpcSig(encodedSig.toString());
            const vrsSig = util_1.rlp.decode(util_1.toBuffer(encodedSig));
            return new Signature(util_1.toBuffer(vrsSig[0]), vrsSig[1], vrsSig[2]);
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
    getRaw() {
        return [this.v, this.r, this.s];
    }
    /**
     *
     */
    toString() {
        if (this.valid()) {
            // ETH serialization/
            // const sigEncoded = toRpcSig(this.v, this.r, this.s); // 0x prefixed Hex string
            // Minter serialization
            const sigEncoded = util_1.rlp.encode([this.v, this.r, this.s]).toString('hex');
            return `${this.type}:0x${sigEncoded}`;
        }
        throw new Error('Invalid signature');
    }
    /**
     * Determines if the signature is valid ECDSA signature
     */
    valid() {
        const message = util_1.sha256(Buffer.from([]));
        const pubKey = PublicKey.fromMessageBuf(message, [this.v, this.r, this.s]);
        return util_1.ethIsValidPublic(pubKey.getRaw());
    }
}
exports.Signature = Signature;
