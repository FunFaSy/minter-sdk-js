/// <reference types="node" />
import {TransactionType} from '../transaction';
import {RlpSchemaField} from '../../util';

export declare abstract class Action {
    raw: Buffer;
    txType: TransactionType;

    constructor(data: any);

    static fromConfig(config: {
        type: string;
        params: any;
    }): Action;

    abstract rlpSchema(): RlpSchemaField[];

    encode(): Buffer;

    type(): TransactionType;
}
