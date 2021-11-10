import {BN, ECDSASignatureBuffer} from '../util/external';
import {Chain} from '../chain';
import defineProperties, {RlpSchemaField} from '../util/define-properties';
import {Address, PublicKey} from '..';
import {TransactionSignature as Signature} from '../transaction/signature';
import {toBuffer} from '../util';

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
    nonce: string;
    coin: number | BN;
    value: string | BN;
}

export class Check implements ECDSASignatureBuffer {
    public raw!: Buffer;

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

    protected signature: Signature;
    protected _from?: Address;
    protected _senderPublicKey?: PublicKey;
    protected _chain: Chain;

    constructor(data: string | Buffer | IssueCheckParams | undefined = undefined, opts: IssueCheckOptions = {}) {

        if (opts.chain) {
            this._chain = opts.chain;
        } else {
            this._chain = new Chain('mainnet');
        }

        // Define RLP Properties
        const rlpSchema: RlpSchemaField[] = [
            {
                name     : 'nonce',
                length   : 32,
                allowLess: true,
                default  : Buffer.allocUnsafe(0),
            }, {
                name   : 'chainId',
                length : 1,
                default: toBuffer([this._chain.networkId()]),
            }, {
                name     : 'dueBlock',
                length   : 8,
                allowLess: true,
                default  : toBuffer(999999999),
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
                default  : toBuffer([this._chain.gasCoin()]),
            }, {
                name     : 'lock',
                allowZero: true,
                allowLess: true,
                length   : 65,
                default  : Buffer.from([]),
            }, {
                name     : 'v',
                allowZero: true,
                default  : Buffer.from([0x1c]),
            }, {
                name     : 'r',
                length   : 32,
                allowZero: true,
                allowLess: true,
                default  : Buffer.from([]),
            }, {
                name     : 's',
                length   : 32,
                allowZero: true,
                allowLess: true,
                default  : Buffer.from([]),
            }];

        // attached serialize
        defineProperties(this, rlpSchema, data);

    }

    sign() {
        return '';
    }
}
