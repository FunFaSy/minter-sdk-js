// secp256k1n/2
import {assertIsArray, base_decode, BN, bufferToInt, ECDSASignatureBuffer, rlp, sha256, toBuffer} from '../util';
import {PublicKey, Signature} from '../key_pair';
import defineProperties, {RlpSchemaField} from '../util/define-properties';
import {Transaction} from './transaction';

const N_DIV_2 = new BN('7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0', 16);

export enum TxSignatureType {
    Single = 1,
    Multi  = 2
}

/**
 *
 */
export abstract class TransactionSignature extends Signature {
    protected raw!: Buffer[];
    protected transaction: Transaction;

    constructor(tx: Transaction = undefined) {
      super(Buffer.from([0x1c]), Buffer.from([]), Buffer.from([]));
      if (tx instanceof Transaction) {
        this.transaction = tx;
      }

    }

    abstract getRaw(): Buffer[];

    abstract serialize(): Buffer;

    abstract publicKey(txHash: Buffer): PublicKey[];

}

/**
 *
 */
export class TxSingleSignature extends TransactionSignature {

  /**
     *
     * @param data RLP encoded ECDSASignatureBuffer [v,r,s] or object type ECDSASignatureBuffer
     * @param tx
     */
  constructor(data: Buffer | ECDSASignatureBuffer, tx: Transaction = undefined) {
    super(tx);
    // Define Properties
    const rlpSchema: RlpSchemaField[] = [
      {
        name   : 'v',
        default: Buffer.from([0x1c]),
      }, {
        name     : 'r',
        length   : 32,
        allowLess: true,
        default  : Buffer.from([]),
      }, {
        name     : 's',
        length   : 32,
        allowLess: true,
        default  : Buffer.from([]),
      }];

    /**
         * Returns the rlp encoding of the transaction
         * @method serialize
         * @return {Buffer}
         * @memberof Transaction
         * @name serialize
         */
    // attached serialize
    defineProperties(this, rlpSchema, data);

    this._overrideVSetterWithValidation();
  }

  static fromString(signature: string): TxSingleSignature {
    return new TxSingleSignature(super.fromString(signature));
  }

  /**
     * Determines if the message signed given public key
     *
     * @param txHash SHA256 transaction hash without signatureData field
     * @param rlpVrs RLP encoded ECDSA signature [v,r,s]
     * @param publicKey
     */
  static assertSignature(txHash: Buffer, rlpVrs: Buffer, publicKey: string): boolean {
    const vrs: Buffer[] = (rlp.decode(rlpVrs) as undefined) as Buffer[];
    assertIsArray(vrs, `Expect rlp encoded ECDSA signature as array of Buffers, but got ${vrs}`);

    const txSignature = new TxSingleSignature(rlpVrs);
    const txPublicKey = base_decode(txSignature.publicKey(txHash).toString().split(':')[1]).toString('utf-8');

    return txSignature.valid() && txPublicKey == publicKey;
  }

  /**
     *
     */
  getRaw(): Buffer[] {
    return this.raw;
  }

  /**
     *  Determines if the signature is valid ECDSA signature
     */
  valid(): boolean {
    // All transaction signatures whose s-value is greater than secp256k1n/2 are considered invalid.
    if (new BN(this.s).cmp(N_DIV_2) === 1) {
      return false;
    }

    return super.valid();
  }

  /**
     * Return singer public key for txHash
     * @param txHash
     */
  publicKey(txHash: Buffer): PublicKey[] {
    const pubKey = PublicKey.fromMessageBuf(txHash, [this.v, this.r, this.s]);
    return [pubKey];
  }

  /**
     * RLP Encode Signature
     */
  serialize(): Buffer {
    // Note: This never gets executed, defineProperties overwrites it.
    return rlp.encode(this.raw);
  }

  // TODO: Throw Error if invalid v
  private _validateV(v?: Buffer): void {
    if (v === undefined || v.length === 0) {
      return;
    }

    const vInt = bufferToInt(v);
    if (vInt === 27 || vInt === 28) {
      return;
    }
    // TODO: throw
  }

  private _overrideVSetterWithValidation() {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const vDescriptor = Object.getOwnPropertyDescriptor(this, 'v')!;

    Object.defineProperty(this, 'v', {
      ...vDescriptor,
      set: (v: any) => {
        if (v !== undefined) {
          this._validateV(toBuffer(v));
        }

                vDescriptor.set?.(v);
      },
    });
  }

}

/**
 *
 */
export class TxMultiSignature extends TransactionSignature {
    // Signature data
    public multisig!: Buffer; // multisig Address
    public signatures!: Buffer[]; // array of single RLP serialized signatures
    protected raw!: Buffer[];
    protected _signatures!: Map<string, TxSingleSignature>;

    /**
     *
     * @param data RLP encoded multisig data
     * @param tx
     */
    constructor(data: Buffer | { multisig: Buffer; signatures: Buffer[] }, tx: Transaction = undefined) {
      super(tx);

      // Define Properties
      const rlpSchema: RlpSchemaField[] = [
        {
          name  : 'multisig',
          length: 20,
        },
        {
          name               : 'signatures',
          allowNonBinaryArray: true,
          nonBinaryArrayTransform(sigBuf) {
            return new TxSingleSignature(sigBuf).getRaw();// Buffer
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
      defineProperties(this, rlpSchema, data);

      if (0 < this.signatures.length) {
        this._signatures = new Map(this.signatures.map((buf) => {
          const sig = new TxSingleSignature(buf);
          const key = sha256(sig.serialize()).toString('hex');
          return [key, sig];
        }));
      }
      //
      else {
        this._signatures = new Map();
      }
    }

    static fromString(signature: string): TxMultiSignature {
      // TODO:
      throw new Error('Not implemented');
      //return new TxMultiSignature(super.fromString(signature));
    }

    /**
     *
     */
    getRaw(): Buffer[] {
      return this.raw;
    }

    /**
     *
     */
    valid(): boolean {
      return Array.from(this._signatures.values()).every((vrsSig) => {
        return vrsSig.valid();
      });
    }

    /**
     * Return singers public key for txHash
     * @param txHash
     */
    publicKey(txHash: Buffer): PublicKey[] {
      return Array.from(this._signatures.values()).reduce((res, sig) => {
        res.push(sig.publicKey(txHash).pop());
        return res;
      }, [] as PublicKey[]);
    }

    /**
     * @return RLP Encoded Signature
     */
    serialize(): Buffer {
      // Note: This never gets executed, defineProperties overwrites it.
      return rlp.encode(this.raw);
    }

    /**
     *
     * @param signature
     */
    addOne(signature: TxSingleSignature): TxMultiSignature {

      const key = sha256(signature.serialize()).toString('hex');
      if (!this._signatures.has(key)) {
        this._signatures.set(key, signature);
        this.signatures = Array.from(this._signatures.values()).reduce((res, sig) => {
          res.push(sig.serialize());
          return res;
        }, [] as Buffer[]);

        if (this.transaction instanceof Transaction) {
          this.transaction.signatureData = this.serialize();
        }
      }

      return this;
    }

    /**
     *
     * @param multisig
     */
    setMultisig(multisig: Buffer): TxMultiSignature {
      this.multisig = multisig;

      if (this.transaction instanceof Transaction) {
        this.transaction.signatureData = this.serialize();
      }

      return this;
    }

}

