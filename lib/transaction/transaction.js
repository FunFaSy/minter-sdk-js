"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignedTransaction = exports.Transaction = exports.TransactionType = void 0;
const util_1 = require("../util");
const signature_1 = require("./signature");
const chain_1 = require("../chain");
const key_pair_1 = require("../key_pair");
const external_1 = require("../util/external");
const define_properties_1 = __importDefault(require("../util/define-properties"));
var TransactionType;
(function (TransactionType) {
    TransactionType["SEND"] = "0x01";
    TransactionType["SELL"] = "0x02";
    TransactionType["SELL_ALL"] = "0x03";
    TransactionType["BUY"] = "0x04";
    TransactionType["CREATE_COIN"] = "0x05";
    TransactionType["DECLARE_CANDIDACY"] = "0x06";
    TransactionType["DELEGATE"] = "0x07";
    TransactionType["UNBOND"] = "0x08";
    TransactionType["REDEEM_CHECK"] = "0x09";
    TransactionType["SET_CANDIDATE_ON"] = "0x0A";
    TransactionType["SET_CANDIDATE_OFF"] = "0x0B";
    TransactionType["CREATE_MULTISIG"] = "0x0C";
    TransactionType["MULTISEND"] = "0x0D";
    TransactionType["EDIT_CANDIDATE"] = "0x0E";
    TransactionType["SET_HALT_BLOCK"] = "0x0F";
    TransactionType["RECREATE_COIN"] = "0x10";
    TransactionType["EDIT_TICKER_OWNER"] = "0x11";
    TransactionType["EDIT_MULTISIG"] = "0x12";
    TransactionType["PRICE_VOTE"] = "0x13";
    TransactionType["EDIT_CANDIDATE_PUBLIC_KEY"] = "0x14";
    TransactionType["ADD_LIQUIDITY"] = "0x15";
    TransactionType["REMOVE_LIQUIDITY"] = "0x16";
    TransactionType["SELL_SWAP_POOL"] = "0x17";
    TransactionType["BUY_SWAP_POOL"] = "0x18";
    TransactionType["SELL_ALL_SWAP_POOL"] = "0x19";
    TransactionType["EDIT_CANDIDATE_COMMISSION"] = "0x1A";
    TransactionType["MOVE_STAKE"] = "0x1B";
    TransactionType["MINT_TOKEN"] = "0x1C";
    TransactionType["BURN_TOKEN"] = "0x1D";
    TransactionType["CREATE_TOKEN"] = "0x1E";
    TransactionType["RECREATE_TOKEN"] = "0x1F";
    TransactionType["VOTE_COMMISSION"] = "0x20";
    TransactionType["VOTE_UPDATE"] = "0x21";
    TransactionType["CREATE_SWAP_POOL"] = "0x22";
    TransactionType["ADD_LIMIT_ORDER"] = "0x23";
    TransactionType["REMOVE_LIMIT_ORDER"] = "0x24";
})(TransactionType = exports.TransactionType || (exports.TransactionType = {}));
/**
 * Minter transaction.
 */
class Transaction {
    constructor(data = undefined, opts = {}) {
        if (opts.chain) {
            this._chain = opts.chain;
        }
        else {
            this._chain = new chain_1.Chain('mainnet');
        }
        // Define RLP Properties
        const rlpSchema = [
            {
                name: 'nonce',
                length: 32,
                allowLess: true,
                default: Buffer.allocUnsafe(0),
            },
            {
                name: 'chainId',
                length: 1,
                default: util_1.toBuffer([this._chain.networkId()]),
            },
            {
                name: 'gasPrice',
                length: 32,
                allowLess: true,
                default: util_1.toBuffer(1),
            },
            {
                name: 'gasCoin',
                length: 4,
                allowLess: true,
                default: util_1.toBuffer([this._chain.gasCoin()]),
            },
            {
                name: 'type',
                length: 1,
                default: util_1.toBuffer([signature_1.SignatureType.Single]),
            },
            {
                name: 'data',
                alias: 'input',
                default: Buffer.allocUnsafe(0),
            },
            {
                name: 'payload',
                allowZero: true,
                default: Buffer.allocUnsafe(0),
            },
            {
                name: 'serviceData',
                allowZero: true,
                default: Buffer.allocUnsafe(0),
            },
            // Signature fields
            {
                name: 'signatureType',
                length: 1,
                allowLess: true,
                default: util_1.toBuffer(signature_1.SignatureType.Single),
            },
            {
                name: 'signatureData',
                default: util_1.toBuffer([]),
            },
        ];
        // attached serialize
        define_properties_1.default(this, rlpSchema, data);
        /**
       * @property {Buffer} from (read only) sender address of this transaction, mathematically derived from other parameters.
       * @name from
       * @memberof Transaction
       */
        Object.defineProperty(this, 'from', {
            enumerable: true,
            configurable: true,
            get: this.getSenderAddress.bind(this),
        });
        if (this.signatureData.length) {
            if (this.isSignatureTypeSingle()) {
                this.signature = new signature_1.SingleSignature(this.signatureData);
            }
            //
            else if (this.isSignatureTypeMulti()) {
                this.signature = new signature_1.MultiSignature(this.signatureData);
            }
        }
    }
    /**
     *
     * @param txMultisig
     * @param keyPair
     */
    static signMulti(txMultisig, keyPair) {
        external_1.assert(txMultisig.isSignatureTypeMulti(), `Multisig transaction expected but got type ${txMultisig.type}`);
        const hash = txMultisig.hash(false);
        const txSignatures = txMultisig.signature;
        const keyPairSign = new signature_1.SingleSignature(keyPair.sign(hash));
        txSignatures.addOne(keyPairSign);
        return new SignedTransaction({ transaction: txMultisig, signature: keyPairSign });
    }
    isSignatureTypeSingle() {
        return util_1.bufferToInt(this.signatureType) == signature_1.SignatureType.Single;
    }
    isSignatureTypeMulti() {
        return util_1.bufferToInt(this.signatureType) == signature_1.SignatureType.Multi;
    }
    getRaw() {
        return this.raw;
    }
    /**
     * returns chain ID
     */
    getChainId() {
        return util_1.bufferToInt(this.chainId);
    }
    /**
     * Computes a sha3-256 hash of the serialized tx
     * @param includeSignature - Whether or not to include the signature
     */
    hash(includeSignature = true) {
        if (includeSignature === undefined) {
            includeSignature = true;
        }
        let items;
        if (includeSignature) {
            items = this.raw;
        }
        //
        else {
            // hash everything except signatureData
            items = this.raw.slice(0, this.raw.length - 1);
        }
        // create hash
        return util_1.rlphash(items);
    }
    /**
     * Returns the sender's address
     * @return {Address}
     */
    getSenderAddress() {
        if (this._from) {
            return this._from;
        }
        if (!this.isValidSignature()) {
            throw new Error('Invalid Signature');
        }
        if (this.isSignatureTypeMulti()) {
            const multiSignature = this.signature;
            this._from = new key_pair_1.Address({ raw: multiSignature.multisig }); // "multisig" field
            return this._from;
        }
        this._from = this.getSenderPublicKey().address();
        return this._from;
    }
    /**
     * returns the public key of the sender
     * @return {Buffer}
     */
    getSenderPublicKey() {
        if (!this.isValidSignature()) {
            throw new Error('Invalid Signature');
        }
        return this._senderPublicKey;
    }
    /**
     *
     * @param keyPair
     */
    sign(keyPair) {
        external_1.assert(this.isSignatureTypeSingle(), `Simple single transaction expected but got type ${this.type}`);
        const hash = this.hash(false);
        this.signature = new signature_1.SingleSignature(keyPair.sign(hash)); // Convert Signature to SingleSignature
        this.signatureData = this.signature.serialize();
        this._senderPublicKey = this.signature.publicKey(hash);
        return new SignedTransaction({ transaction: this, signature: this.signature });
    }
    /**
     *
     * @param keyPair
     */
    signAsync(keyPair) {
        return new Promise((resolve, reject) => {
            try {
                const signedTxData = this.sign(keyPair);
                return resolve(signedTxData);
            }
            catch (e) {
                reject(e);
            }
        });
    }
    validate(stringError = false) {
        const errors = [];
        if (!this.isValidSignature()) {
            errors.push('Invalid Signature');
        }
        if (stringError === false) {
            return errors.length === 0;
        }
        else {
            return errors.join(' ');
        }
    }
    /**
     * Determines if the signature is valid
     * Side effect - setting up _senderPublicKey field
     * @return {Boolean}
     */
    isValidSignature() {
        const isValid = this.signature instanceof signature_1.TransactionSignature && this.signature.valid();
        if (isValid && this.isSignatureTypeSingle()) {
            if (!(this._senderPublicKey instanceof key_pair_1.PublicKey)) {
                const txHash = this.hash(false);
                this._senderPublicKey = this.signature.publicKey(txHash);
            }
        }
        return isValid;
    }
    /**
     * Returns the rlp encoding of the transaction
     */
    serialize() {
        // Note: This never gets executed, defineProperties overwrites it.
        return util_1.rlp.encode(this.raw);
    }
    /**
     *
     */
    encode() {
        return this.serialize();
    }
    /**
     * Returns the transaction in JSON format
     * @see {@link https://github.com/ethereumjs/ethereumjs-util/blob/master/docs/index.md#defineproperties|ethereumjs-util}
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    toJSON(labels = false) {
        // Note: This never gets executed, defineProperties overwrites it.
        return {};
    }
    /**
     *
     */
    isSigned() {
        return this.signature instanceof signature_1.TransactionSignature;
    }
    getSignature() {
        if (!this.isSigned()) {
            return undefined;
        }
        return this.signature;
    }
    toString() {
        return this.serialize().toString('hex');
    }
}
exports.Transaction = Transaction;
/**
 *
 */
class SignedTransaction extends util_1.Assignable {
    static decode(bytes) {
        const tx = new Transaction(bytes);
        return new SignedTransaction({
            transaction: tx,
            signature: tx.getSignature(),
        });
    }
    encode() {
        this.transaction.signatureData = this.signature.serialize();
        return this.transaction.serialize();
    }
    toString() {
        return this.transaction.toString();
    }
}
exports.SignedTransaction = SignedTransaction;
