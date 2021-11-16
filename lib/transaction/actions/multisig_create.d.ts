/// <reference types="bn.js" />
/// <reference types="node" />
import { BN } from '../../util';
import { TransactionType } from '../internal';
import { Action } from './action';
import { RlpSchemaField } from '../../util/define-properties';
/**
 *
 */
export interface CreateMultiSigActionParams {
    threshold: number | BN;
    weights: number[] | BN[];
    addresses: string[];
}
/**
 *
 */
export declare class CreateMultiSigAction extends Action {
    static readonly txType = TransactionType.CREATE_MULTISIG;
    threshold: Buffer;
    weights: Buffer[];
    addresses: Buffer[];
    constructor(data?: string | Buffer | CreateMultiSigActionParams);
    rlpSchema(): RlpSchemaField[];
}
