// secp256k1n/2
import {BN, bufferToInt, defineProperties, rlp, toBuffer} from '../util';
import {Buffer} from 'buffer';
import {ECDSASignature, ECDSASignatureBuffer, ecrecover} from 'ethereumjs-util/dist/signature';

const N_DIV_2 = new BN('7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0', 16);

export enum SignatureType {
    Single = 1,
    Multi  = 2
}

export interface Signature {
    getRaw(): Buffer[];

    serialize(): Buffer;

    pubKey(messageHash: Buffer): Buffer;

    isValid(messageHash: Buffer): boolean;
}

export class SingleSignature implements Signature {
    protected raw!: Buffer[];
    // ECDSA data fields
    public v!: Buffer;
    public r!: Buffer;
    public s!: Buffer;

    /**
     *
     * @param data RLP encoded vrs
     */
    constructor(data: Buffer | ECDSASignature | ECDSASignatureBuffer) {
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

        this._validateV(toBuffer(this.v));
        this._overrideVSetterWithValidation();
    }

    serialize(): Buffer {
        // Note: This never gets executed, defineProperties overwrites it.
        return rlp.encode(this.raw);
    }

    isValid(messageHash: Buffer): boolean {
        // const vrs = rlp.decode(this.raw);
        return SingleSignature.verify(messageHash, [this.v, this.r, this.s]);
    }

    pubKey(messageHash): Buffer {
        try {
            const v = bufferToInt(this.v);
            return ecrecover(messageHash, v, this.r, this.s);
        }
        catch (error) {
            return Buffer.from([]);
        }
    }

    getRaw(): Buffer[] {
        return this.raw;
    }

    private _validateV(v?: Buffer): void {
        if (v === undefined || v.length === 0) {
            return;
        }

        const vInt = bufferToInt(v);
        if (vInt === 27 || vInt === 28) {
            return;
        }
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

    public static verify(messageHash: Buffer, vrs): boolean {
        // All transaction signatures whose s-value is greater than secp256k1n/2 are considered invalid.
        if (new BN(vrs[2]).cmp(N_DIV_2) === 1) {
            return false;
        }

        try {
            const v = bufferToInt(vrs[0]);
            const senderPublicKey = ecrecover(messageHash, v, vrs[1], vrs[2]);
            return !!senderPublicKey;
        }
        catch (error) {
            return false;
        }
    }

}

export class MultiSignature implements Signature {
    protected raw!: Buffer[];
    // Signature data
    public multisig!: Buffer;
    public signatures!: Buffer[];
    protected _signatures!: SingleSignature[];

    /**
     *
     * @param data RLP encoded multisig struct
     */
    constructor(data: Buffer) {
        // Define Properties
        const rlpSchema = [
            {
                name  : 'multisig',
                length: 20,
            },
            {
                name               : 'signatures',
                allowNonBinaryArray: true,
                nonBinaryArrayTransform(item) {
                    return new SingleSignature(item).getRaw();
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

    isValid(messageHash: Buffer): boolean {
        const invalid = this._signatures.filter((vrsSig) => {
            return !vrsSig.isValid(messageHash);
        });
        return invalid.length == 0;
    }

    getRaw(): Buffer[] {
        return this.raw;
    }

    pubKey(messageHash: Buffer): Buffer {
        return Buffer.from([]);
    }

    serialize(): Buffer {
        // Note: This never gets executed, defineProperties overwrites it.
        return rlp.encode(this.raw);
    }

}

