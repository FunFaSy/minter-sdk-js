"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignedTransaction = exports.Transaction = void 0;
const util_1 = require("../util");
const external_1 = require("../util/external");
const define_properties_1 = __importDefault(require("../util/define-properties"));
const chain_1 = require("../chain");
const key_pair_1 = require("../key_pair");
const signature_1 = require("./signature");
const action_registry_1 = __importDefault(require("./action_registry"));
/**
 * Minter transaction.
 */
class Transaction {
    constructor(data, opts = {}) {
        this.signature = null;
        this._from = null;
        this._senderPublicKey = null;
        this._chain = null;
        this._action = null;
        if (typeof data == 'object' && !Buffer.isBuffer(data)) {
            // TODO: Prepare params .
        }
        // Define RLP Properties
        define_properties_1.default(this, Transaction.rlpSchema(), data);
        if (opts.chain) {
            this._chain = opts.chain;
            this.chainId = util_1.toBuffer(this._chain.chainId);
        }
        //
        else if (this.chainId.length) {
            this._chain = new chain_1.Chain(parseInt(this.chainId.toString('hex'), 16));
        }
        //
        else {
            this._chain = new chain_1.Chain(chain_1.ChainId.MAINNET);
            this.chainId = util_1.toBuffer(this._chain.chainId);
        }
        if (!this.gasCoin.length) {
            this.gasCoin = util_1.toBuffer([this._chain.gasCoin]);
        }
        if (this.signatureData.length) {
            if (this.isSignatureTypeSingle()) {
                this.signature = new signature_1.TxSingleSignature(this.signatureData, this);
            }
            //
            else if (this.isSignatureTypeMulti()) {
                this.signature = new signature_1.TxMultiSignature(this.signatureData, this);
            }
            else {
                throw new Error('Unknown signature type');
            }
        }
        // RLP encoded action
        if (this.data.length) {
            // Recover Action from Buffer
            const actionType = '0x' + util_1.toBuffer(this.type).toString('hex').toUpperCase();
            const ActionClass = action_registry_1.default.get(actionType);
            if (ActionClass) {
                this._action = new ActionClass(this.data);
            }
            else {
                util_1.logWarning(`Unregistered action type ${actionType}`);
            }
        }
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
    }
    /**
     *
     */
    static rlpSchema() {
        return [
            {
                name: 'nonce',
                length: 32,
                allowLess: true,
                default: Buffer.allocUnsafe(0),
            },
            {
                name: 'chainId',
                length: 1,
                allowZero: true,
                default: Buffer.from([0]),
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
                default: Buffer.allocUnsafe(0),
            },
            {
                name: 'type',
                length: 1,
                default: util_1.toBuffer([signature_1.TxSignatureType.Single]),
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
                default: util_1.toBuffer(signature_1.TxSignatureType.Single),
            },
            {
                name: 'signatureData',
                default: Buffer.allocUnsafe(0),
            },
        ];
    }
    isSignatureTypeSingle() {
        return util_1.bufferToInt(this.signatureType) == signature_1.TxSignatureType.Single;
    }
    isSignatureTypeMulti() {
        return util_1.bufferToInt(this.signatureType) == signature_1.TxSignatureType.Multi;
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
        if (this.isSignatureTypeMulti()) {
            throw new Error('Unable to determine public key for Multisig transaction!');
        }
        return this._senderPublicKey;
    }
    getAction() {
        return this._action;
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
     *
     * @param keyPair
     * @param multiSigAddress Mx or 0x prefixed string
     */
    sign(keyPair, multiSigAddress = null) {
        const hash = this.hash(false);
        const vrsSig = keyPair.sign(hash);
        if (this.isSignatureTypeSingle()) {
            this.signature = new signature_1.TxSingleSignature(vrsSig, this); // Convert Signature to TxSingleSignature;
            // Side effect
            this._senderPublicKey = this.signature.publicKey(hash).pop();
        }
        //
        else if (this.isSignatureTypeMulti()) {
            external_1.assert(util_1.isValidAddress(multiSigAddress), `Multisig transaction expect valid Multisig address, but got ${multiSigAddress}`);
            if (!this.signature || !(this.signature instanceof signature_1.TxMultiSignature)) {
                this.signature = new signature_1.TxMultiSignature({ multisig: util_1.toBuffer(multiSigAddress), signatures: [] }, this);
            }
            this.signature.addOne(new signature_1.TxSingleSignature(vrsSig)); //
            this.signature.setMultisig(util_1.toBuffer(multiSigAddress)); //
            Object.assign(this.signature, vrsSig);
        }
        //
        else {
            throw new Error('Unknown signature type!');
        }
        // Sync signature instance to Tx.signatureData
        this.signatureData = this.signature.serialize();
        // this.signature.on('channge',(sig: TransactionSignature) => {
        //     this.signatureData = sig.serialize();
        // });
        return new SignedTransaction({ transaction: this, signature: this.signature });
    }
    /**
     *
     * @param keyPair
     */
    async signAsync(keyPair) {
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
            // Side effect
            if (!(this._senderPublicKey instanceof key_pair_1.PublicKey)) {
                const txHash = this.hash(false);
                this._senderPublicKey = this.signature.publicKey(txHash).pop();
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
        return this.signature instanceof signature_1.TransactionSignature && this.signature.valid();
    }
    getSignature() {
        if (!this.isSigned()) {
            return undefined;
        }
        return this.signature;
    }
    toString() {
        return '0x' + this.serialize().toString('hex');
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
    serialize() {
        return this.transaction.serialize();
    }
    toString() {
        return this.transaction.toString();
    }
}
exports.SignedTransaction = SignedTransaction;
