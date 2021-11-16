/// <reference types="bn.js" />
/// <reference types="node" />
import { BN } from '../../util';
import { TransactionType } from '../internal';
import { Action } from './action';
import { RlpSchemaField } from '../../util/define-properties';
/**
 *
 */
export interface BurnTokenActionParams {
    coin: number | BN;
    value: string | BN;
}
/**
 *
 */
export declare class BurnTokenAction extends Action {
    static readonly txType = TransactionType.BURN_TOKEN;
    coin: Buffer;
    value: Buffer;
    constructor(data?: string | Buffer | BurnTokenActionParams);
    rlpSchema(): RlpSchemaField[];
}
