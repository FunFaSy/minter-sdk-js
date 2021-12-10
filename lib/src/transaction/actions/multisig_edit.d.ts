/// <reference types="bn.js" />
/// <reference types="node" />
import { BN } from '../../util';
import { TransactionType } from '../internal';
import { Action } from './action';
import { RlpSchemaField } from '../../util/define-properties';
/**
 *
 */
export interface EditMultiSigActionParams {
    threshold: number | BN;
    weights: number[] | BN[];
    addresses: string[];
}
/**
 *
 */
export declare class EditMultiSigAction extends Action {
    static readonly txType = TransactionType.EDIT_MULTISIG;
    threshold: Buffer;
    weights: Buffer[];
    addresses: Buffer[];
    constructor(data?: string | Buffer | EditMultiSigActionParams);
    rlpSchema(): RlpSchemaField[];
}
