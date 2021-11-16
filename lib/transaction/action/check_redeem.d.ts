/// <reference types="node" />
import { TransactionType } from '../transaction';
import { Action } from './action';
import { RlpSchemaField } from '../../util/define-properties';
import { Check } from '../../check/check';
/**
 *
 */
export interface RedeemCheckActionParams {
    check: string | Check;
    proof: string | Buffer;
}
/**
 *
 */
export declare class RedeemCheckAction extends Action {
    static readonly txType = TransactionType.REDEEM_CHECK;
    check: Buffer;
    proof: Buffer;
    constructor(params: RedeemCheckActionParams);
    rlpSchema(): RlpSchemaField[];
}
