import {Buffer} from 'buffer';
import {bufferToInt, defineProperties, ecsign, ethPublicToAddress, rlp, rlphash, toBuffer} from '../util';
import {Assignable, BufferLike} from '../util/types';
import {MultiSignature, SignatureType, SingleSignature, TransactionSignature as Signature} from './signature';
import Chain from '../chain';


export enum TransactionType {
    SEND                      = '0x01',
    SELL                      = '0x02',
    SELL_ALL                  = '0x03',
    BUY                       = '0x04',
    CREATE_COIN               = '0x05',
    DECLARE_CANDIDACY         = '0x06',
    DELEGATE                  = '0x07',
    UNBOND                    = '0x08',
    REDEEM_CHECK              = '0x09',
    SET_CANDIDATE_ON          = '0x0A',
    SET_CANDIDATE_OFF         = '0x0B',
    CREATE_MULTISIG           = '0x0C',
    MULTISEND                 = '0x0D',
    EDIT_CANDIDATE            = '0x0E',
    SET_HALT_BLOCK            = '0x0F',
    RECREATE_COIN             = '0x10',
    EDIT_TICKER_OWNER         = '0x11',
    EDIT_MULTISIG             = '0x12',
    PRICE_VOTE                = '0x13',
    EDIT_CANDIDATE_PUBLIC_KEY = '0x14',
    ADD_LIQUIDITY             = '0x15',
    REMOVE_LIQUIDITY          = '0x16',
    SELL_SWAP_POOL            = '0x17',
    BUY_SWAP_POOL             = '0x18',
    SELL_ALL_SWAP_POOL        = '0x19',
    EDIT_CANDIDATE_COMMISSION = '0x1A',
    MOVE_STAKE                = '0x1B',
    MINT_TOKEN                = '0x1C',
    BURN_TOKEN                = '0x1D',
    CREATE_TOKEN              = '0x1E',
    RECREATE_TOKEN            = '0x1F',
    VOTE_COMMISSION           = '0x20',
    VOTE_UPDATE               = '0x21',
    CREATE_SWAP_POOL          = '0x22',
}

/**
 *
 */
export interface TransactionOptions {
    /**
     * A Common object defining the chain a transaction belongs to.
     */
    chain?: Chain;

    /**
     * The chain of the transaction, default: 'mainnet'
     */
    chainId?: number | string;
}

/**
 * Minter transaction.
 */
export class Transaction {
    public raw!: Buffer[];

    public nonce!: Buffer;
    public chainId!: Buffer;
    public gasPrice!: Buffer;
    public gasCoin!: Buffer;
    public type!: Buffer;
    public data: Buffer;
    public payload!: Buffer;
    public serviceData!: Buffer;

    public signatureType!: Buffer;
    public signatureData!: Buffer;
    protected signature: Signature;

    protected _from?: Buffer;
    protected _senderPublicKey?: Buffer;
    protected _chain: Chain;

    constructor(data: BufferLike | object | undefined = undefined, opts: TransactionOptions = {}) {

        if (opts.chain) {
            this._chain = opts.chain;
        } else {
            this._chain = new Chain('mainnet');
        }

        // Define RLP Properties
        const rlpSchema = [
            {
                name     : 'nonce',
                length   : 32,
                allowLess: true,
                default  : toBuffer([]),
            },
            {
                name   : 'chainId',
                length : 1,
                default: toBuffer([this._chain.networkId()]),
            },
            {
                name     : 'gasPrice',
                length   : 32,
                allowLess: true,
                default  : toBuffer(1),
            },
            {
                name     : 'gasCoin',
                length   : 4,
                allowLess: true,
                default  : toBuffer([this._chain.gasCoin()]),
            },
            {
                name   : 'type',
                length : 1,
                default: toBuffer([]),
            },
            {
                name   : 'data',
                alias  : 'input',
                default: toBuffer([]),
            },
            {
                name     : 'payload',
                allowZero: true,
                default  : toBuffer([]),
            },
            {
                name     : 'serviceData',
                allowZero: true,
                default  : toBuffer([]),
            },
            // Signature fields
            {
                name     : 'signatureType',
                length   : 1,
                allowLess: true,
                default  : toBuffer(SignatureType.Single),
            },
            {
                name   : 'signatureData',
                default: toBuffer([]),
            }];

        // attached serialize
        defineProperties(this, rlpSchema, data);

        /**
         * @property {Buffer} from (read only) sender address of this transaction, mathematically derived from other parameters.
         * @name from
         * @memberof Transaction
         */
        Object.defineProperty(this, 'from', {
            enumerable  : true,
            configurable: true,
            get         : this.getSenderAddress.bind(this),
        });

        if (this.isSignatureTypeSingle()) {
            this.signature = new SingleSignature(this.signatureData);
        } else if (this.isSignatureTypeMulti()) {
            this.signature = new MultiSignature(this.signatureData);
        }

    }

    isSignatureTypeSingle(): boolean {
        return bufferToInt(this.signatureType) == SignatureType.Single;
    }

    isSignatureTypeMulti(): boolean {
        return bufferToInt(this.signatureType) == SignatureType.Multi;
    }

    getRaw(): Buffer[] {return this.raw;}

    /**
     * Computes a sha3-256 hash of the serialized tx
     * @param includeSignature - Whether or not to include the signature
     */
    hash(includeSignature = true): Buffer {
        if (includeSignature === undefined) {
            includeSignature = true;
        }

        // EIP155 spec:
        // when computing the hash of a transaction for purposes of signing or recovering,
        // instead of hashing only the first six elements (ie. nonce, gasprice, startgas, to, value, data),
        // hash nine elements, with v replaced by CHAIN_ID, r = 0 and s = 0
        let items;
        if (includeSignature) {
            items = this.raw;
        } else {
            // hash everything except signatureData
            items = this.raw.slice(0, this.raw.length - 1);
        }

        // create hash
        return rlphash(items);
    }

    /**
     * returns the sender's address
     * @return {Buffer}
     */
    getSenderAddress() {
        if (this._from) {
            return this._from;
        }

        if (this.isSignatureTypeMulti()) {
            const multiSignature = this.signature as MultiSignature;
            this._from = toBuffer(multiSignature.getRaw()[0]);// "multisig" field
            return this._from;
        }

        const publicKey = this.getSenderPublicKey();
        this._from = ethPublicToAddress(publicKey);
        return this._from;
    }

    /**
     * returns the public key of the sender
     * @return {Buffer}
     */
    getSenderPublicKey() {
        if (!this.verifySignature()) {
            throw new Error('Invalid Signature');
        }

        return this._senderPublicKey;
    }

    signAsync(keyPair): Promise<SignedTransaction> {
        return new Promise<SignedTransaction>((resolve, reject) => {
            try {
                const signedTxData = this.sign(keyPair);
                return resolve(signedTxData);
            }
            catch (e) {
                reject(e);
            }

        });
    }

    sign(privateKey): SignedTransaction {
        const privateKeyBuffer = toBuffer(privateKey);
        const hash = this.hash(false);
        const vrsSig = ecsign(hash, privateKeyBuffer);

        const signature = new SingleSignature(vrsSig);
        return new SignedTransaction({transaction: this, signature});
    }

    /**
     * returns chain ID
     */
    getChainId(): number {
        return bufferToInt(this.chainId);
    }

    /**
     * Validates the signature and checks to see if it has enough gas.
     */
    validate(): boolean
    validate(stringError: false): boolean
    validate(stringError: true): string
    validate(stringError = false): boolean | string {
        const errors = [];
        if (!this.verifySignature()) {
            errors.push('Invalid Signature');
        }

        if (stringError === false) {
            return errors.length === 0;
        } else {
            return errors.join(' ');
        }
    }

    /**
     * Determines if the signature is valid
     * Side effect - setting up _senderPublicKey field
     * @return {Boolean}
     */
    verifySignature(): boolean {
        const messageHash = this.hash(false);
        const isValidSig = this.signature.isValid(messageHash);

        if (isValidSig && this.isSignatureTypeSingle()) {

            if (!this._senderPublicKey || !this._senderPublicKey.length) {
                try {
                    this._senderPublicKey = this.signature.pubKey(messageHash)[0];
                }
                catch (error) {
                    return false;
                }
            }
        }

        return isValidSig;
    }

    /**
     * Returns the rlp encoding of the transaction
     */
    serialize(): Buffer {
        // Note: This never gets executed, defineProperties overwrites it.
        return rlp.encode(this.raw);
    }

    encode(): Buffer {
        return this.serialize();
    }

    /**
     * Returns the transaction in JSON format
     * @see {@link https://github.com/ethereumjs/ethereumjs-util/blob/master/docs/index.md#defineproperties|ethereumjs-util}
     */
    toJSON(labels = false): { [key: string]: string } | string[] {
        // Note: This never gets executed, defineProperties overwrites it.
        return {};
    }

    isSigned() {
        return this.signature instanceof Signature;
    }

    getSignature(): Signature | undefined {
        if (!this.isSigned()) {return undefined;}
        return this.signature;
    }
}

export class SignedTransaction extends Assignable {
    transaction: Transaction;
    signature: Signature;

    encode(): Buffer {
        return rlp.encode(Buffer.concat([...this.transaction.getRaw(), ...this.signature.getRaw()]));
    }

    static decode(bytes: Buffer): SignedTransaction {
        const tx = new Transaction(bytes);
        return new SignedTransaction({
            transaction: tx,
            signature  : tx.getSignature(),
        });
    }
}

