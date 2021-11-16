/// <reference types="bn.js" />
/// <reference types="node" />
import { BN } from '../../util';
import { TransactionType } from '../transaction';
import { Action } from './action';
import { RlpSchemaField } from '../../util/define-properties';
/**
 *
 */
export interface RemoveLimitOrderActionParams {
    orderId: number | BN;
}
/**
 *
 */
export declare class RemoveLimitOrderAction extends Action {
    static readonly txType = TransactionType.REMOVE_LIMIT_ORDER;
    orderId: Buffer;
    constructor(params: RemoveLimitOrderActionParams);
    rlpSchema(): RlpSchemaField[];
}
