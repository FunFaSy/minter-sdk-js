/// <reference types="bn.js" />
/// <reference types="node" />
import { BN } from '../../util';
import { TransactionType } from '../internal';
import { Action } from './action';
import { RlpSchemaField } from '../../util/define-properties';
/**
 *
 */
export interface SendActionParams {
    to: string;
    coin: number | BN;
    value: string | BN;
}
/**
 *
 */
export declare class SendAction extends Action {
    static readonly txType = TransactionType.SEND;
    coin: Buffer;
    to: Buffer;
    value: Buffer;
    constructor(data?: string | Buffer | SendActionParams);
    rlpSchema(): RlpSchemaField[];
}
