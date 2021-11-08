import {Assignable, bufferToInt, defineProperties, rlp, rlphash, toBuffer} from '../util';
import {MultiSignature, SignatureType, SingleSignature, TransactionSignature as Signature} from './signature';
import {Chain} from '../chain';
import {Address, KeyPair, PublicKey} from '../key_pair';
import {assert} from '../util/external';

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

export interface TransactionParams {
    nonce?: number;  // Hex Int
    chainId?: number; // Hex Int
    gasPrice?: number; // Hex Int
    gasCoin?: number; // Hex Int
    type: TransactionType; // Hex Int
    data: Buffer; // RLP Encoded Tx Action
    payload?: string; // Buffer
    serviceData?: string; // Buffer
    signatureType: SignatureType; // Hex Int
    signatureData?: Buffer;// RLP encoded ECDSASignature or MultiSignature
}

/**
 * Minter transaction.
 */
export class Transaction {
    public raw!: Buffer[];

    public nonce!: Buffer;  // Hex Int
    public chainId!: Buffer; // Hex Int
    public gasPrice!: Buffer; // Hex Int
    public gasCoin!: Buffer; // Hex Int
    public type!: Buffer; // Hex Int
    public data!: Buffer; // RLP Encoded Tx Action
    public payload!: Buffer; // Buffer
    public serviceData!: Buffer; // Buffer
    public signatureType!: Buffer; //  Hex Int
    public signatureData!: Buffer;// RLP encoded ECDSASignature or MultiSignature

    protected signature: Signature;
    protected _from?: Address;
    protected _senderPublicKey?: PublicKey;
    protected _chain: Chain;

    constructor(data: string | Buffer | TransactionParams | undefined = undefined, opts: TransactionOptions = {}) {

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
                default: toBuffer([SignatureType.Single]),
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
            },
        ];

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

        if (this.signatureData.length) {
            if (this.isSignatureTypeSingle()) {
                this.signature = new SingleSignature(this.signatureData);
            }
            //
            else if (this.isSignatureTypeMulti()) {
                this.signature = new MultiSignature(this.signatureData);
            }
        }

    }

    isSignatureTypeSingle(): boolean {
        return bufferToInt(this.signatureType) == SignatureType.Single;
    }

    isSignatureTypeMulti(): boolean {
        return bufferToInt(this.signatureType) == SignatureType.Multi;
    }

    getRaw(): Buffer[] {
        return this.raw;
    }

    /**
     * returns chain ID
     */
    getChainId(): number {
        return bufferToInt(this.chainId);
    }

    /**
     * Computes a sha3-256 hash of the serialized tx
     * @param includeSignature - Whether or not to include the signature
     */
    hash(includeSignature = true): Buffer {
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
        return rlphash(items);
    }

    /**
     * Returns the sender's address
     * @return {Address}
     */
    getSenderAddress(): Address {
        if (this._from) {
            return this._from;
        }

        if (!this.isValidSignature()) {
            throw new Error('Invalid Signature');
        }

        if (this.isSignatureTypeMulti()) {
            const multiSignature = this.signature as MultiSignature;
            this._from = new Address({raw: multiSignature.multisig});// "multisig" field
            return this._from;
        }

        this._from = this.getSenderPublicKey().address();

        return this._from;
    }

    /**
     * returns the public key of the sender
     * @return {Buffer}
     */
    getSenderPublicKey(): PublicKey {
        if (!this.isValidSignature()) {
            throw new Error('Invalid Signature');
        }

        return this._senderPublicKey;
    }

    /**
     *
     * @param keyPair
     */
    sign(keyPair: KeyPair): SignedTransaction {
        assert(
            this.isSignatureTypeSingle(),
            `Simple single transaction expected but got type ${this.type}`,
        );

        const hash = this.hash(false);

        this.signature = new SingleSignature(keyPair.sign(hash)); // Convert Signature to SingleSignature
        this.signatureData = this.signature.serialize();

        this._senderPublicKey = (this.signature as SingleSignature).publicKey(hash);

        return new SignedTransaction({transaction: this, signature: this.signature});
    }

    /**
     *
     * @param keyPair
     */
    signAsync(keyPair: KeyPair): Promise<SignedTransaction> {
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

    /**
     * Validates the signature and checks to see if it has enough gas.
     */
    validate(): boolean
    validate(stringError: false): boolean
    validate(stringError: true): string
    validate(stringError = false): boolean | string {
        const errors = [];
        if (!this.isValidSignature()) {
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
    isValidSignature(): boolean {
        const isValid = this.signature instanceof Signature && this.signature.valid();

        if (isValid && this.isSignatureTypeSingle()) {

            if (!(this._senderPublicKey instanceof PublicKey)) {
                const txHash = this.hash(false);
                this._senderPublicKey = (this.signature as SingleSignature).publicKey(txHash);
            }
        }

        return isValid;
    }

    /**
     * Returns the rlp encoding of the transaction
     */
    serialize(): Buffer {
        // Note: This never gets executed, defineProperties overwrites it.
        return rlp.encode(this.raw);
    }

    /**
     *
     */
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

    /**
     *
     */
    isSigned(): boolean {
        return this.signature instanceof Signature;
    }

    getSignature(): Signature | undefined {
        if (!this.isSigned()) {return undefined;}
        return this.signature;
    }

    toString() {
        return this.serialize().toString('hex');
    }

    /**
     *
     * @param txMultisig
     * @param keyPair
     */
    static signMulti(txMultisig: Transaction, keyPair: KeyPair): SignedTransaction {
        assert(
            txMultisig.isSignatureTypeMulti(),
            `Multisig transaction expected but got type ${txMultisig.type}`,
        );

        const hash = txMultisig.hash(false);

        const txSignatures = txMultisig.signature as MultiSignature;
        const keyPairSign = new SingleSignature(keyPair.sign(hash));
        txSignatures.addOne(keyPairSign);

        return new SignedTransaction({transaction: txMultisig, signature: keyPairSign});
    }

}

/**
 *
 */
export class SignedTransaction extends Assignable {
    transaction: Transaction;
    signature: Signature;

    encode(): Buffer {
        this.transaction.signatureData = this.signature.serialize();
        return this.transaction.serialize();
    }

    toString() {
        return this.transaction.toString();
    }

    static decode(bytes: Buffer): SignedTransaction {
        const tx = new Transaction(bytes);
        return new SignedTransaction({
            transaction: tx,
            signature  : tx.getSignature(),
        });
    }
}

