"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Check = void 0;
const external_1 = require("../util/external");
const chain_1 = require("../chain");
const define_properties_1 = __importDefault(require("../util/define-properties"));
const __1 = require("..");
const util_1 = require("../util");
const key_pair_1 = require("../key_pair");
class Check {
    /**
     *
     * @param data 0x prefixed string OR Buffer Rlp decoded check OR IssueCheckParams
     * @param opts
     */
    constructor(data = undefined, opts = {}) {
        //
        if (typeof data === 'object') {
            // Convert params to valid types
            data = {
                ...data,
                ...{
                    nonce: 'nonce' in data ? new external_1.BN(data.nonce) : undefined,
                    chainId: 'chainId' in data ? new external_1.BN(data.chainId) : 0,
                    dueBlock: 'dueBlock' in data ? new external_1.BN(data.dueBlock) : new external_1.BN(999999999),
                    coin: 'coin' in data ? new external_1.BN(data.coin) : undefined,
                    value: 'value' in data ? new external_1.BN(data.value) : undefined,
                    gasCoin: 'gasCoin' in data ? new external_1.BN(data.gasCoin) : undefined,
                    lock: undefined,
                },
            };
        }
        //
        else if (typeof data == 'string') {
            data = util_1.toBuffer(data); //Remove Mc/0x prefix and convert to Buffer
        }
        // Define RLP Properties
        define_properties_1.default(this, Check.rlpSchema(), data);
        if (opts.chain) {
            this._chain = opts.chain;
            this.chainId = util_1.toBuffer(this._chain.networkId());
        }
        //
        else if (this.chainId.length) {
            const chainId = parseInt(this.chainId.toString('hex'), 16);
            this._chain = new chain_1.Chain(chainId);
        }
        //
        else {
            this._chain = new chain_1.Chain('mainnet');
            this.chainId = util_1.toBuffer(this._chain.networkId());
        }
        if (!this.gasCoin.length) {
            this.gasCoin = util_1.toBuffer(this._chain.gasCoin());
        }
        if (!this.lock.length && typeof data == 'object' && data?.password) {
            this.setLock(data.password);
        }
        if (!this.dueBlock.length) {
            this.dueBlock = util_1.toBuffer(new external_1.BN(__1.MINTER_LAST_BLOCK_HEIGHT));
        }
        // TODO: Validate
    }
    static rlpSchema() {
        return [
            {
                name: 'nonce',
                length: 32,
                allowLess: true,
                default: Buffer.allocUnsafe(0),
            }, {
                name: 'chainId',
                length: 1,
                allowZero: true,
                default: Buffer.from([0]),
            }, {
                name: 'dueBlock',
                length: 8,
                allowLess: true,
                default: util_1.toBuffer(__1.MINTER_LAST_BLOCK_HEIGHT),
            }, {
                name: 'coin',
                length: 4,
                allowLess: true,
                default: Buffer.allocUnsafe(0),
            }, {
                name: 'value',
                length: 32,
                allowLess: true,
                default: util_1.toBuffer(0),
            }, {
                name: 'gasCoin',
                length: 4,
                allowLess: true,
                default: Buffer.allocUnsafe(0),
            }, {
                name: 'lock',
                allowZero: true,
                allowLess: true,
                length: 65,
                default: Buffer.allocUnsafe(0),
            }, {
                name: 'v',
                allowZero: true,
                default: Buffer.from([0x1c]),
            }, {
                name: 'r',
                length: 32,
                allowZero: true,
                allowLess: true,
                default: Buffer.allocUnsafe(0),
            }, {
                name: 's',
                length: 32,
                allowZero: true,
                allowLess: true,
                default: Buffer.allocUnsafe(0),
            },
        ];
    }
    /**
     * Generate check redeem Proof for given password and redeemer account address
     * @param password string
     * @param address Address
     */
    static getProof(password, address) {
        //TODO: Validate params
        const passwdBuf = typeof password === 'string' ? Buffer.from(password, 'utf-8') : util_1.toBuffer(password);
        const addressHash = util_1.rlphash([util_1.toBuffer(address)]);
        const passwordHash = external_1.sha256(passwdBuf);
        const proof = external_1.secp256k1.ecdsaSign(addressHash, passwordHash);
        const proofWithRecovery = Buffer.alloc(65);
        proofWithRecovery.set(proof.signature, 0);
        proofWithRecovery[64] = proof.recid;
        return proofWithRecovery;
    }
    getRaw() {
        return this.raw;
    }
    /**
     *
     * @param password
     */
    setLock(password) {
        const checkHash = this.hash();
        const passwordBuf = (typeof password === 'string') ? Buffer.from(password, 'utf-8') : util_1.toBuffer(password);
        const passwordHash = external_1.sha256(passwordBuf);
        const lockSig = external_1.secp256k1.ecdsaSign(checkHash, passwordHash);
        /** @type Buffer */
        const lockWithRecovery = Buffer.alloc(65);
        lockWithRecovery.set(lockSig.signature, 0);
        lockWithRecovery[64] = lockSig.recid;
        this.lock = util_1.toBuffer(`0x${lockWithRecovery.toString('hex')}`);
        return this;
    }
    /**
     * Computes a sha3-256 hash of the serialized check
     * @param withLock Include the lock to hash or not
     */
    hash(withLock = false) {
        const items = (withLock)
            ? this.raw.slice(0, this.raw.length - 3) // exclude v r s
            : this.raw.slice(0, this.raw.length - 4); // exclude v r s lock
        // create hash
        return util_1.rlphash(items);
    }
    /**
     *
     * @param keyPair
     * @param password
     */
    sign(keyPair, password = undefined) {
        if (password?.length) {
            this.setLock(password);
        }
        if (!this.lock.length) {
            throw new Error('Set up lock before sign. Or sign with password param.');
        }
        const lockedCheckHash = this.hash(true);
        this._signature = keyPair.sign(lockedCheckHash);
        this.v = this._signature.v;
        this.r = this._signature.r;
        this.s = this._signature.s;
        return this;
    }
    valid() {
        // TODO: Validate check
        return true;
    }
    /**
     * Determines if the signature is valid
     * @return {Boolean}
     */
    isValidSignature() {
        return this._signature instanceof key_pair_1.Signature && this._signature.valid();
    }
    /**
     *
     */
    isSigned() {
        return this.isValidSignature();
    }
    getSignature() {
        if (!this.isSigned()) {
            return undefined;
        }
        return this._signature;
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
    toString() {
        return util_1.MinterPrefix.CHEQUE + this.serialize().toString('hex');
    }
}
exports.Check = Check;
