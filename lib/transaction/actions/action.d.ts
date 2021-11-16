/// <reference types="node" />
import { TransactionType } from '../internal';
import { RlpSchemaField } from '../../util/define-properties';
/**
 *
 */
export declare abstract class Action {
    static readonly txType: TransactionType;
    raw: Buffer[];
    constructor(data: any);
    static constructorByType(type: TransactionType): Action;
    abstract rlpSchema(): RlpSchemaField[];
    type(): TransactionType;
    /**
     *
     */
    getRaw(): Buffer[];
    /**
     * Returns the rlp encoding of the action
     */
    encode(): Buffer;
    /**
     * Returns the rlp encoding of the action
     */
    serialize(): Buffer;
    /**
     * Return 0x prefixed hex of `serialise` method result
     */
    serializeToString(): string;
    /**
     * Returns the action in JSON format
     * @see {@link https://github.com/ethereumjs/ethereumjs-util/blob/master/docs/index.md#defineproperties|ethereumjs-util}
     */
    toJSON(labels?: boolean): {
        [key: string]: string;
    } | string[];
}
