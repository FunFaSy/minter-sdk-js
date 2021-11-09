// secp256k1n/2
import {
    assertIsArray,
    base_decode,
    BN,
    BufferLike,
    bufferToInt,
    defineProperties,
    ECDSASignatureBuffer,
    rlp,
    toBuffer,
} from '../util';
import {KeyPairSecp256k1, KeyType, PublicKey,  Signature} from '../key_pair';

const N_DIV_2 = new BN('7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0', 16);

export enum SignatureType {
    Single = 1,
    Multi  = 2
}

/**
 *
 */
export abstract class TransactionSignature extends Signature {
    constructor() {
        super(Buffer.from([0x1c]), Buffer.from([]), Buffer.from([]));
    }

    abstract getRaw(): Buffer[];

    abstract serialize(): Buffer;
}

/**
 *
 */
export class SingleSignature extends TransactionSignature {
    protected raw!: Buffer[];

    /**
     *
     * @param data RLP encoded ECDSASignatureBuffer [v,r,s] or object type ECDSASignatureBuffer
     */
    constructor(data: Buffer | ECDSASignatureBuffer) {
        super();
        // Define Properties
        const rlpSchema = [
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
    publicKey(txHash: Buffer): PublicKey {
        const rawPubKey = KeyPairSecp256k1.publicKeyFromMessageBuf(txHash, [this.v, this.r, this.s]);
        return new PublicKey({keyType: KeyType.SECP256K1, raw: rawPubKey});
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
        const vDescriptor = Object.getOwnPropertyDescriptor(this, 'v')!;

        Object.defineProperty(this, 'v', {
            ...vDescriptor,
            set: v => {
                if (v !== undefined) {
                    this._validateV(toBuffer(v));
                }

                vDescriptor.set!(v);
            },
        });
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

        const txSignature = new SingleSignature(rlpVrs);
        const txPublicKey = base_decode(txSignature.publicKey(txHash).toString().split(':')[1]).toString('utf-8');

        return txSignature.valid() && txPublicKey == publicKey;
    }

}

/**
 *
 */
export class MultiSignature extends TransactionSignature {
    protected raw!: Buffer[];

    // Signature data
    public multisig!: Buffer; // multisig Address
    public signatures!: Buffer[]; // array of single rlp signatures
    protected _signatures!: SingleSignature[];

    /**
     *
     * @param data RLP encoded multisig data
     */
    constructor(data: BufferLike | { multisig: Buffer; signatures: Buffer[] }) {
        super();

        // Define Properties
        const rlpSchema = [
            {
                name  : 'multisig',
                length: 20,
            },
            {
                name               : 'signatures',
                allowNonBinaryArray: true,
                nonBinaryArrayTransform(rlpVrs) {
                    return new SingleSignature(rlpVrs).getRaw();
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

        this._signatures = this.signatures.map((data) => {
            return new SingleSignature(data);
        });
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
        return this._signatures.every((vrsSig) => {
            return vrsSig.valid();
        });
    }

    /**
     * Return singers public key for txHash
     * @param txHash
     */
    publicKey(txHash: Buffer): PublicKey[] {
        return this._signatures.reduce((res, sig) => {
            res.push(sig.publicKey(txHash));
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
    addOne(signature: SingleSignature): MultiSignature{
        this._signatures.push(signature);
        this.signatures.push(signature.serialize());
        return this;
    }

    /**
     *
     * @param multisig
     */
    setMultisig(multisig: Buffer): void{
        this.multisig = multisig;
    }
}

