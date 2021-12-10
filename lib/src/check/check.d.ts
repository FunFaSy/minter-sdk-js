/// <reference types="bn.js" />
/// <reference types="node" />
import { BN } from '../util/external';
import { Chain } from '../chain';
import { RlpSchemaField } from '../util/define-properties';
import { KeyPair } from '..';
import { Signature } from '../key_pair';
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
export declare class Check {
    raw: Buffer[];
    nonce: Buffer;
    chainId: Buffer;
    dueBlock: Buffer;
    coin: Buffer;
    value: Buffer;
    gasCoin: Buffer;
    lock: Buffer;
    r: Buffer;
    s: Buffer;
    v: Buffer;
    protected _signature: Signature;
    protected _chain: Chain;
    /**
     *
     * @param data 0x prefixed string OR Buffer Rlp decoded check OR IssueCheckParams
     * @param opts
     */
    constructor(data?: string | Buffer | IssueCheckParams | undefined, opts?: IssueCheckOptions);
    static rlpSchema(): RlpSchemaField[];
    /**
     * Generate check redeem Proof for given password and redeemer account address
     * @param password string
     * @param address Address
     */
    static getProof(password: string, address: string): Buffer;
    getRaw(): Buffer[];
    /**
     *
     * @param password
     */
    setLock(password: string): Check;
    /**
     * Computes a sha3-256 hash of the serialized check
     * @param withLock Include the lock to hash or not
     */
    hash(withLock?: boolean): Buffer;
    /**
     *
     * @param keyPair
     * @param password
     */
    sign(keyPair: KeyPair, password?: string): Check;
    valid(): boolean;
    /**
     * Determines if the signature is valid
     * @return {Boolean}
     */
    isValidSignature(): boolean;
    /**
     *
     */
    isSigned(): boolean;
    getSignature(): Signature | undefined;
    /**
     * Returns the rlp encoding of the transaction
     */
    serialize(): Buffer;
    /**
     * Returns the transaction in JSON format
     * @see {@link https://github.com/ethereumjs/ethereumjs-util/blob/master/docs/index.md#defineproperties|ethereumjs-util}
     */
    toJSON(labels?: boolean): {
        [key: string]: string;
    } | string[];
    /**
     *
     */
    toString(): string;
}
