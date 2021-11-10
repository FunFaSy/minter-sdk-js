/// <reference types="node" />
import { Assignable } from '../util';
import { SignatureType, TransactionSignature as Signature } from './signature';
import { Chain } from '../chain';
import { Address, KeyPair, PublicKey } from '../key_pair';
export declare enum TransactionType {
    SEND = "0x01",
    SELL = "0x02",
    SELL_ALL = "0x03",
    BUY = "0x04",
    CREATE_COIN = "0x05",
    DECLARE_CANDIDACY = "0x06",
    DELEGATE = "0x07",
    UNBOND = "0x08",
    REDEEM_CHECK = "0x09",
    SET_CANDIDATE_ON = "0x0A",
    SET_CANDIDATE_OFF = "0x0B",
    CREATE_MULTISIG = "0x0C",
    MULTISEND = "0x0D",
    EDIT_CANDIDATE = "0x0E",
    SET_HALT_BLOCK = "0x0F",
    RECREATE_COIN = "0x10",
    EDIT_TICKER_OWNER = "0x11",
    EDIT_MULTISIG = "0x12",
    PRICE_VOTE = "0x13",
    EDIT_CANDIDATE_PUBLIC_KEY = "0x14",
    ADD_LIQUIDITY = "0x15",
    REMOVE_LIQUIDITY = "0x16",
    SELL_SWAP_POOL = "0x17",
    BUY_SWAP_POOL = "0x18",
    SELL_ALL_SWAP_POOL = "0x19",
    EDIT_CANDIDATE_COMMISSION = "0x1A",
    MOVE_STAKE = "0x1B",
    MINT_TOKEN = "0x1C",
    BURN_TOKEN = "0x1D",
    CREATE_TOKEN = "0x1E",
    RECREATE_TOKEN = "0x1F",
    VOTE_COMMISSION = "0x20",
    VOTE_UPDATE = "0x21",
    CREATE_SWAP_POOL = "0x22"
}
/**
 *
 */
export interface TransactionOptions {
    /**
     * A Chain object defining the chain a transaction belongs to.
     */
    chain?: Chain;
    /**
     * The chain of the transaction, default: 'mainnet'
     */
    chainId?: number | string;
}
export interface TransactionParams {
    nonce?: number;
    chainId?: number;
    gasPrice?: number;
    gasCoin?: number;
    type: TransactionType;
    data: Buffer;
    payload?: string;
    serviceData?: string;
    signatureType: SignatureType;
    signatureData?: Buffer;
}
/**
 * Minter transaction.
 */
export declare class Transaction {
    raw: Buffer[];
    nonce: Buffer;
    chainId: Buffer;
    gasPrice: Buffer;
    gasCoin: Buffer;
    type: Buffer;
    data: Buffer;
    payload: Buffer;
    serviceData: Buffer;
    signatureType: Buffer;
    signatureData: Buffer;
    protected signature: Signature;
    protected _from?: Address;
    protected _senderPublicKey?: PublicKey;
    protected _chain: Chain;
    constructor(data?: string | Buffer | TransactionParams | undefined, opts?: TransactionOptions);
    /**
     *
     * @param txMultisig
     * @param keyPair
     */
    static signMulti(txMultisig: Transaction, keyPair: KeyPair): SignedTransaction;
    isSignatureTypeSingle(): boolean;
    isSignatureTypeMulti(): boolean;
    getRaw(): Buffer[];
    /**
     * returns chain ID
     */
    getChainId(): number;
    /**
     * Computes a sha3-256 hash of the serialized tx
     * @param includeSignature - Whether or not to include the signature
     */
    hash(includeSignature?: boolean): Buffer;
    /**
     * Returns the sender's address
     * @return {Address}
     */
    getSenderAddress(): Address;
    /**
     * returns the public key of the sender
     * @return {Buffer}
     */
    getSenderPublicKey(): PublicKey;
    /**
     *
     * @param keyPair
     */
    sign(keyPair: KeyPair): SignedTransaction;
    /**
     *
     * @param keyPair
     */
    signAsync(keyPair: KeyPair): Promise<SignedTransaction>;
    /**
     * Validates the signature and checks to see if it has enough gas.
     */
    validate(): boolean;
    validate(stringError: false): boolean;
    validate(stringError: true): string;
    /**
     * Determines if the signature is valid
     * Side effect - setting up _senderPublicKey field
     * @return {Boolean}
     */
    isValidSignature(): boolean;
    /**
     * Returns the rlp encoding of the transaction
     */
    serialize(): Buffer;
    /**
     *
     */
    encode(): Buffer;
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
    isSigned(): boolean;
    getSignature(): Signature | undefined;
    toString(): string;
}
/**
 *
 */
export declare class SignedTransaction extends Assignable {
    transaction: Transaction;
    signature: Signature;
    static decode(bytes: Buffer): SignedTransaction;
    encode(): Buffer;
    toString(): string;
}
