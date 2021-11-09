/// <reference types="node" />
import { TransactionType } from '../transaction';
import { RlpSchemaField } from '../../util';
export declare abstract class Action {
    raw: Buffer;
    txType: TransactionType;
    constructor(data: any);
    abstract rlpSchema(): RlpSchemaField[];
    /**
     * Returns the rlp encoding of the action
     */
    encode(): Buffer;
    /**
     * Returns the rlp encoding of the action
     */
    serialize(): Buffer;
    type(): TransactionType;
    /**
     * Returns the action in JSON format
     * @see {@link https://github.com/ethereumjs/ethereumjs-util/blob/master/docs/index.md#defineproperties|ethereumjs-util}
     */
    toJSON(labels?: boolean): {
        [key: string]: string;
    } | string[];
}