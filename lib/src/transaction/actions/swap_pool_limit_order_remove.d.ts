/// <reference types="bn.js" />
/// <reference types="node" />
import { BN } from '../../util';
import { TransactionType } from '../internal';
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
    constructor(data?: string | Buffer | RemoveLimitOrderActionParams);
    rlpSchema(): RlpSchemaField[];
}
