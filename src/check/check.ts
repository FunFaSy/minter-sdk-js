import {BN, secp256k1, sha256} from '../util/external';
import {Chain} from '../chain';
import defineProperties, {RlpSchemaField} from '../util/define-properties';
import {KeyPair, MINTER_LAST_BLOCK_HEIGHT} from '..';

import {MinterPrefix, rlp, rlphash, toBuffer} from '../util';
import {Signature} from '../key_pair';

export interface IssueCheckOptions {
    /**
     * A Chain object defining the chain a transaction belongs to.
     */
    chain?: Chain;

    /**
     * The chain of the transaction, default: 'mainnet'
     */
    chainId?: number | string;
}

export interface IssueCheckParams {
    nonce: string | number | BN;
    coin: number | BN;
    value: string | BN;
    chainId?: number | BN;
    dueBlock?: number | BN;
    gasCoin?: number | BN;
    password?: string;
}

export class Check {
    public raw!: Buffer[];

    public nonce: Buffer;
    public chainId: Buffer;
    public dueBlock: Buffer;
    public coin: Buffer;
    public value: Buffer;
    public gasCoin: Buffer;
    public lock: Buffer;

    public r: Buffer;
    public s: Buffer;
    public v: Buffer;

    protected _signature: Signature;
    protected _chain: Chain;

    /**
     *
     * @param data 0x prefixed string OR Buffer Rlp decoded check OR IssueCheckParams
     * @param opts
     */
    constructor(data: string | Buffer | IssueCheckParams | undefined = undefined, opts: IssueCheckOptions = {}) {

        //
        if (typeof data === 'object') {
            // Convert params to valid types
            data = {
                ...data,
                ...{
                    nonce   : 'nonce' in data ? new BN(data.nonce) : undefined,
                    chainId : 'chainId' in data ? new BN(data.chainId) : 0,
                    dueBlock: 'dueBlock' in data ? new BN(data.dueBlock) : new BN(999999999),
                    coin    : 'coin' in data ? new BN(data.coin) : undefined,
                    value   : 'value' in data ? new BN(data.value) : undefined,
                    gasCoin : 'gasCoin' in data ? new BN(data.gasCoin) : undefined,
                    lock    : undefined,
                },
            } as IssueCheckParams;
        }
        //
        else if (typeof data == 'string') {
            data = toBuffer(data);//Remove Mc/0x prefix and convert to Buffer
        }

        // Define RLP Properties
        defineProperties(this, Check.rlpSchema(), data);

        if (opts.chain) {
            this._chain = opts.chain;
            this.chainId = toBuffer(this._chain.networkId());
        }
        //
        else if (this.chainId.length) {
            const chainId = parseInt(this.chainId.toString('hex'), 16);
            this._chain = new Chain(chainId);
        }
        //
        else {
            this._chain = new Chain('mainnet');
            this.chainId = toBuffer(this._chain.networkId());
        }

        if (!this.gasCoin.length) {
            this.gasCoin = toBuffer(this._chain.gasCoin());
        }

        if (!this.lock.length && typeof data == 'object' && (data as IssueCheckParams)?.password) {
            this.setLock((data as IssueCheckParams).password);
        }

        if (!this.dueBlock.length) {
            this.dueBlock = toBuffer(new BN(MINTER_LAST_BLOCK_HEIGHT));
        }

        // TODO: Validate

    }

    static rlpSchema(): RlpSchemaField[] {
        return [
            {
                name     : 'nonce',
                length   : 32,
                allowLess: true,
                default  : Buffer.allocUnsafe(0),
            }, {
                name     : 'chainId',
                length   : 1,
                allowZero: true,
                default  : Buffer.from([0]),
            }, {
                name     : 'dueBlock',
                length   : 8,
                allowLess: true,
                default  : toBuffer(MINTER_LAST_BLOCK_HEIGHT),
            }, {
                name     : 'coin',
                length   : 4,
                allowLess: true,
                default  : Buffer.allocUnsafe(0),
            }, {
                name     : 'value',
                length   : 32,
                allowLess: true,
                default  : toBuffer(0),
            }, {
                name     : 'gasCoin',
                length   : 4,
                allowLess: true,
                default  : Buffer.allocUnsafe(0),
            }, {
                name     : 'lock',
                allowZero: true,
                allowLess: true,
                length   : 65,
                default  : Buffer.allocUnsafe(0),
            }, {
                name     : 'v',
                allowZero: true,
                default  : Buffer.from([0x1c]),
            }, {
                name     : 'r',
                length   : 32,
                allowZero: true,
                allowLess: true,
                default  : Buffer.allocUnsafe(0),
            }, {
                name     : 's',
                length   : 32,
                allowZero: true,
                allowLess: true,
                default  : Buffer.allocUnsafe(0),
            },
        ];

    }

    /**
     * Generate check redeem Proof for given password and redeemer account address
     * @param password string
     * @param address Address
     */
    static getProof(password: string, address: string): Buffer {
        //TODO: Validate params

        const passwdBuf = typeof password === 'string' ? Buffer.from(password, 'utf-8') : toBuffer(password);
        const addressHash = rlphash([toBuffer(address)]);
        const passwordHash = sha256(passwdBuf);

        const proof = secp256k1.ecdsaSign(addressHash, passwordHash);
        const proofWithRecovery = Buffer.alloc(65);
        proofWithRecovery.set(proof.signature, 0);
        proofWithRecovery[64] = proof.recid;

        return proofWithRecovery;
    }

    getRaw(): Buffer[] {
        return this.raw;
    }

    /**
     *
     * @param password
     */
    setLock(password: string): Check {
        const checkHash = this.hash();
        const passwordBuf = (typeof password === 'string') ? Buffer.from(password, 'utf-8') : toBuffer(password);

        const passwordHash = sha256(passwordBuf);
        const lockSig = secp256k1.ecdsaSign(checkHash, passwordHash);

        /** @type Buffer */
        const lockWithRecovery: Buffer = Buffer.alloc(65);
        lockWithRecovery.set(lockSig.signature, 0);
        lockWithRecovery[64] = lockSig.recid;

        this.lock = toBuffer(`0x${lockWithRecovery.toString('hex')}`);

        return this;
    }

    /**
     * Computes a sha3-256 hash of the serialized check
     * @param withLock Include the lock to hash or not
     */
    hash(withLock = false): Buffer {

        const items = (withLock)
            ? this.raw.slice(0, this.raw.length - 3)  // exclude v r s
            : this.raw.slice(0, this.raw.length - 4); // exclude v r s lock

        // create hash
        return rlphash(items);
    }

    /**
     *
     * @param keyPair
     * @param password
     */
    sign(keyPair: KeyPair, password: string = undefined): Check {

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

    valid(): boolean {

        // TODO: Validate check
        return true;
    }

    /**
     * Determines if the signature is valid
     * @return {Boolean}
     */
    isValidSignature(): boolean {
        return this._signature instanceof Signature && this._signature.valid();
    }

    /**
     *
     */
    isSigned(): boolean {
        return this.isValidSignature();
    }

    getSignature(): Signature | undefined {
        if (!this.isSigned()) {return undefined;}
        return this._signature;
    }

    /**
     * Returns the rlp encoding of the transaction
     */
    serialize(): Buffer {
        // Note: This never gets executed, defineProperties overwrites it.
        return rlp.encode(this.raw);
    }

    /**
     * Returns the transaction in JSON format
     * @see {@link https://github.com/ethereumjs/ethereumjs-util/blob/master/docs/index.md#defineproperties|ethereumjs-util}
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    toJSON(labels = false): { [key: string]: string } | string[] {
        // Note: This never gets executed, defineProperties overwrites it.
        return {};
    }

    /**
     *
     */
    toString() {
        return MinterPrefix.CHEQUE + this.serialize().toString('hex');
    }
}
