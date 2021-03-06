"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TxMultiSignature = exports.TxSingleSignature = exports.TransactionSignature = exports.TxSignatureType = void 0;
// secp256k1n/2
const util_1 = require("../util");
const key_pair_1 = require("../key_pair");
const define_properties_1 = __importDefault(require("../util/define-properties"));
const transaction_1 = require("./transaction");
const N_DIV_2 = new util_1.BN('7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0', 16);
var TxSignatureType;
(function (TxSignatureType) {
    TxSignatureType[TxSignatureType["Single"] = 1] = "Single";
    TxSignatureType[TxSignatureType["Multi"] = 2] = "Multi";
})(TxSignatureType = exports.TxSignatureType || (exports.TxSignatureType = {}));
/**
 *
 */
class TransactionSignature extends key_pair_1.Signature {
    constructor(tx = undefined) {
        super(Buffer.from([0x1c]), Buffer.from([]), Buffer.from([]));
        if (tx instanceof transaction_1.Transaction) {
            this.transaction = tx;
        }
    }
}
exports.TransactionSignature = TransactionSignature;
/**
 *
 */
class TxSingleSignature extends TransactionSignature {
    /**
       *
       * @param data RLP encoded ECDSASignatureBuffer [v,r,s] or object type ECDSASignatureBuffer
       * @param tx
       */
    constructor(data, tx = undefined) {
        super(tx);
        // Define Properties
        const rlpSchema = [
            {
                name: 'v',
                default: Buffer.from([0x1c]),
            }, {
                name: 'r',
                length: 32,
                allowLess: true,
                default: Buffer.from([]),
            }, {
                name: 's',
                length: 32,
                allowLess: true,
                default: Buffer.from([]),
            }
        ];
        /**
             * Returns the rlp encoding of the transaction
             * @method serialize
             * @return {Buffer}
             * @memberof Transaction
             * @name serialize
             */
        // attached serialize
        define_properties_1.default(this, rlpSchema, data);
        this._overrideVSetterWithValidation();
    }
    static fromString(signature) {
        return new TxSingleSignature(super.fromString(signature));
    }
    /**
       * Determines if the message signed given public key
       *
       * @param txHash SHA256 transaction hash without signatureData field
       * @param rlpVrs RLP encoded ECDSA signature [v,r,s]
       * @param publicKey
       */
    static assertSignature(txHash, rlpVrs, publicKey) {
        const vrs = util_1.rlp.decode(rlpVrs);
        util_1.assertIsArray(vrs, `Expect rlp encoded ECDSA signature as array of Buffers, but got ${vrs}`);
        const txSignature = new TxSingleSignature(rlpVrs);
        const txPublicKey = util_1.base_decode(txSignature.publicKey(txHash).toString().split(':')[1]).toString('utf-8');
        return txSignature.valid() && txPublicKey == publicKey;
    }
    /**
       *
       */
    getRaw() {
        return this.raw;
    }
    /**
       *  Determines if the signature is valid ECDSA signature
       */
    valid() {
        // All transaction signatures whose s-value is greater than secp256k1n/2 are considered invalid.
        if (new util_1.BN(this.s).cmp(N_DIV_2) === 1) {
            return false;
        }
        return super.valid();
    }
    /**
       * Return singer public key for txHash
       * @param txHash
       */
    publicKey(txHash) {
        const pubKey = key_pair_1.PublicKey.fromMessageBuf(txHash, [this.v, this.r, this.s]);
        return [pubKey];
    }
    /**
       * RLP Encode Signature
       */
    serialize() {
        // Note: This never gets executed, defineProperties overwrites it.
        return util_1.rlp.encode(this.raw);
    }
    // TODO: Throw Error if invalid v
    _validateV(v) {
        if (v === undefined || v.length === 0) {
            return;
        }
        const vInt = util_1.bufferToInt(v);
        if (vInt === 27 || vInt === 28) {
            return;
        }
        // TODO: throw
    }
    _overrideVSetterWithValidation() {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const vDescriptor = Object.getOwnPropertyDescriptor(this, 'v');
        Object.defineProperty(this, 'v', {
            ...vDescriptor,
            set: (v) => {
                if (v !== undefined) {
                    this._validateV(util_1.toBuffer(v));
                }
                vDescriptor.set?.(v);
            },
        });
    }
}
exports.TxSingleSignature = TxSingleSignature;
/**
 *
 */
class TxMultiSignature extends TransactionSignature {
    /**
     *
     * @param data RLP encoded multisig data
     * @param tx
     */
    constructor(data, tx = undefined) {
        super(tx);
        // Define Properties
        const rlpSchema = [
            {
                name: 'multisig',
                length: 20,
            },
            {
                name: 'signatures',
                allowNonBinaryArray: true,
                nonBinaryArrayTransform(sigBuf) {
                    return new TxSingleSignature(sigBuf).getRaw(); // Buffer
                },
            },
        ];
        /**
           * Returns the rlp encoding of the transaction
           * @method serialize
           * @return {Buffer}
           * @memberof Transaction
           * @name serialize
           */
        // attached serialize
        define_properties_1.default(this, rlpSchema, data);
        if (0 < this.signatures.length) {
            this._signatures = new Map(this.signatures.map((buf) => {
                const sig = new TxSingleSignature(buf);
                const key = util_1.sha256(sig.serialize()).toString('hex');
                return [key, sig];
            }));
        }
        //
        else {
            this._signatures = new Map();
        }
    }
    static fromString(signature) {
        // TODO:
        throw new Error('Not implemented');
        //return new TxMultiSignature(super.fromString(signature));
    }
    /**
     *
     */
    getRaw() {
        return this.raw;
    }
    /**
     *
     */
    valid() {
        return Array.from(this._signatures.values()).every((vrsSig) => {
            return vrsSig.valid();
        });
    }
    /**
     * Return singers public key for txHash
     * @param txHash
     */
    publicKey(txHash) {
        return Array.from(this._signatures.values()).reduce((res, sig) => {
            res.push(sig.publicKey(txHash).pop());
            return res;
        }, []);
    }
    /**
     * @return RLP Encoded Signature
     */
    serialize() {
        // Note: This never gets executed, defineProperties overwrites it.
        return util_1.rlp.encode(this.raw);
    }
    /**
     *
     * @param signature
     */
    addOne(signature) {
        const key = util_1.sha256(signature.serialize()).toString('hex');
        if (!this._signatures.has(key)) {
            this._signatures.set(key, signature);
            this.signatures = Array.from(this._signatures.values()).reduce((res, sig) => {
                res.push(sig.serialize());
                return res;
            }, []);
            if (this.transaction instanceof transaction_1.Transaction) {
                this.transaction.signatureData = this.serialize();
            }
        }
        return this;
    }
    /**
     *
     * @param multisig
     */
    setMultisig(multisig) {
        this.multisig = multisig;
        if (this.transaction instanceof transaction_1.Transaction) {
            this.transaction.signatureData = this.serialize();
        }
        return this;
    }
}
exports.TxMultiSignature = TxMultiSignature;
