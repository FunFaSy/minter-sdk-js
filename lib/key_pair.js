"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Signature = exports.Address = exports.PublicKey = exports.KeyPairSecp256k1 = exports.KeyPair = exports.KeyType = void 0;
const util_1 = require("./util");
const external_1 = require("./util/external");
const bip39 = __importStar(require("bip39"));
const hdkey_1 = require("ethereum-cryptography/hdkey");
const constants_1 = require("./constants");
/** All supported key types */
var KeyType;
(function (KeyType) {
    KeyType[KeyType["SECP256K1"] = 0] = "SECP256K1";
    KeyType[KeyType["ED25519"] = 1] = "ED25519";
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
const isValidMnemonic = (mnemonic) => {
    return typeof mnemonic === 'string' && mnemonic.trim().split(/\s+/g).length >= 12 &&
        bip39.validateMnemonic(mnemonic);
};
class KeyPair {
    constructor(publicKey, secretKey) {
        this._publicKey = publicKey;
        this._secretKey = secretKey;
    }
    /**
     * @param curve Name of elliptical curve, case-insensitive
     * @returns Random KeyPair based on the curve
     */
    static fromRandom(curve) {
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
        return `${keyType2Str(this._publicKey.keyType)}:${util_1.base_encode(this._secretKey)}`;
    }
    address() {
        return this._publicKey.address();
    }
    publicKey() {
        return this._publicKey;
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
        const publicKey = util_1.ethPrivateToPublic(_secretKey);
        super(new PublicKey({ keyType: KeyType.SECP256K1, raw: publicKey }), _secretKey);
    }
    /**
     * Generate a new random secp256k1 keypair.
     * @example
     * const keyRandom = KeyPairSecp256k1.fromRandom();
     * keyRandom.publicKey()
     * // returns [PUBLIC_KEY]
     *
     * keyRandom.toString()
     * // returns [SECRET_KEY]
     */
    static fromRandom() {
        const secretKey = util_1.secp256k1.createPrivateKeySync();
        return new KeyPairSecp256k1(util_1.base_encode(secretKey));
    }
    /**
     * Generate a new secp256k1 keypair based on BIP39 mnemonic phrase.
     * @example
     *  const keyPair = KeyPairSecp256k1.fromBip39Mnemonic('solar when satoshi champion about zebra ....')
     * keyRandom.publicKey()
     * // returns [PUBLIC_KEY]
     * keyRandom.toString()
     * // returns [SECRET_KEY]
     *
     * @param mnemonic
     * @param deriveChildId number
     */
    static fromBip39Mnemonic(mnemonic, deriveChildId = 0) {
        external_1.assert(isValidMnemonic(mnemonic), 'Invalid mnemonic phrase');
        util_1.assertIsPositiveInt(deriveChildId);
        const seed = bip39.mnemonicToSeedSync(mnemonic);
        const secretKey = hdkey_1.HDKey.fromMasterSeed(seed).
            derive(constants_1.MINTER_DERIVATION_PATH).
            deriveChild(deriveChildId).privateKey;
        return new KeyPairSecp256k1(util_1.base_encode(secretKey));
    }
    static publicKeyFromMessageBuf(message, signature) {
        util_1.assertIsBuffer(signature[0]);
        util_1.assertIsBuffer(signature[1]);
        util_1.assertIsBuffer(signature[2]);
        const bufV = signature[0];
        const bufR = signature[1];
        const bufS = signature[2];
        try {
            const v = util_1.bufferToInt(bufV);
            // ecrecover throw error in case invalid signature
            return util_1.ecrecover(message, v, bufR, bufS);
        }
        catch (error) {
            return Buffer.from([]);
        }
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
     */
    toString() {
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
                const publicKey = KeyPairSecp256k1.publicKeyFromMessageBuf(message, signature);
                return publicKey && this.raw.equals(publicKey);
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
    address() {
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
        return util_1.ethIsValidPublic(KeyPairSecp256k1.publicKeyFromMessageBuf(message, [this.v, this.r, this.s]));
    }
}
exports.Signature = Signature;
