import {Buffer} from 'buffer';
import {defineProperties, ecsign, publicToAddress, toBuffer} from '../util';
import {Assignable} from '../util/types';
import {MultiSignature, Signature, SignatureType, SingleSignature} from './signature';
import Chain from '../util/chain';
import {BufferLike} from '../util/functions/serialize';
import * as rlp from 'rlp';
import {rlphash} from 'ethereumjs-util/dist/hash';
import {bufferToInt} from 'ethereumjs-util/dist/bytes';
import {ecrecover} from 'ethereumjs-util/dist/signature';
import TxData from 'minterjs-tx/src/tx-data';

/**
 * An Minter transaction.
 */
export default  abstract class Transaction {
    public raw!: Buffer[];

    public nonce!: Buffer;
    public chainId!: Buffer;
    public gasPrice!: Buffer;
    public gasCoin!: Buffer;
    public type!: Buffer;
    public payload!: Buffer;
    public serviceData!: Buffer;

    public signatureType!: Buffer;
    public signatureData!: Buffer;
    protected _signature: Signature;

    protected _from?: Buffer;
    protected _senderPublicKey?: Buffer;
    protected _chain: Chain;

    constructor(data: BufferLike, opts: TransactionOptions = {}) {

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
                default: toBuffer([this._chain.id()]),
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
                default  : toBuffer([]),
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

        if (this.signatureType == toBuffer(SignatureType.Single)) {
            this._signature = new SingleSignature(this.signatureData);
        } else {
            this._signature = new MultiSignature(this.signatureData);
        }

    }

    isSignatureTypeSingle(): boolean {
        return bufferToInt(this.signatureType) == SignatureType.Single;
    }

    isSignatureTypeMulti(): boolean {
        return bufferToInt(this.signatureType) == SignatureType.Multi;
    }

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
            const multiSignature = this._signature as MultiSignature;
            this._from = toBuffer(multiSignature.getRaw()[0]);// "multisig" field
            return this._from;
        }

        const publicKey = this.getSenderPublicKey();
        this._from = publicToAddress(publicKey);
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

        return new SignedTransaction({transaction: this, signature: new SingleSignature(vrsSig), hash});
    }

    /**
     * returns chain ID
     */
    getChainId(): number {
        return this._chain.id();
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
        const isValidSig = this._signature.isValid(messageHash);

        if (isValidSig && this.isSignatureTypeSingle()) {
            if (!this._senderPublicKey || !this._senderPublicKey.length) {
                try {
                    const vrsRaw = this._signature.getRaw();
                    const v = bufferToInt(vrsRaw[0]);
                    this._senderPublicKey = ecrecover(messageHash, v, vrsRaw[1], vrsRaw[2]);
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

export class SignedTransaction extends Assignable {
    transaction: Transaction;
    hash: Buffer;
    signature: Signature;

    encode(): Buffer {
        return Buffer.from([]);
    }

    static decode(bytes: Buffer): SignedTransaction {
        return new SignedTransaction({
            transaction: null,
            signature  : null,
        });
    }
}


interface TransactionParams {
     nonce: Buffer;
     chainId: Buffer;
     gasPrice: Buffer;
     gasCoin: Buffer;
     type: Buffer;
     payload: Buffer; // TxData
     serviceData: Buffer;
     signatureType: Buffer;
     signatureData: Buffer;
}

interface SendTransactionParams extends TransactionParams{
    data: {
        to: 'Mx7633980c000139dd3bd24a3f54e06474fa941e16',
        value: 10,
        coin: 0, // coin id
    }
}

export class SendTransaction extends Transaction{
    static fromParams(txParams): Transaction {

        const txData = TxData();
        return new Transaction(Buffer.from([]));
    }
}



/**
 *
 */

export class TransactionData extends Assignable {}

// export class Send extends Transaction {
//     value: BN;
//     to: Buffer;
//     coin: Coin;
// }
//
// export class MultiSend extends Transaction {list: Send[];}
//
// export class Buy extends Transaction {
//     coinToSell: Coin;
//     coinToBuy: Coin;
//     valueToBuy: BN;
//     maximumValueToSell?: BN; // optional, 10^15 by default
// }
//
// export class Sell extends Transaction {
//     coinToSell: Coin;
//     coinToBuy: Coin;
//     valueToSell: BN;
//     minimumValueToBuy?: BN; // optional, 0 by default
// }
//
// export class SellAll extends Transaction {
//     coinToSell: Coin;
//     coinToBuy: Coin;
//     minimumValueToBuy?: BN;// optional, 0 by default
// }
//
// export class BuyFromSwapPool extends Transaction {
//     coins: Coin[]; // route of coin from spent to received
//     valueToBuy: BN;
//     maximumValueToSell?: BN; // optional, 10^15 by default
// }
//
// export class SellFromSwapPool extends Transaction {
//     coins: Coin[]; // route of coin from spent to received
//     coinToSell: BN;
//     minimumValueToBuy?: BN; // optional, 10^15 by default
// }
//
// export interface TransactionResponse {
//     hash: string;
//     raw_tx: string;
//     height: string | number;
//     index: string | number;
//     from: string;
//     nonce: string | number;
//     gas: string | number;
//     gas_price: string | number;
//     gas_coin: ICoin;
//     type: string | number;
//     data: any;
//     payload: string;
//     tags: { [key: string]: any };
//     code: string | number;
//     log: string;
// }
//
