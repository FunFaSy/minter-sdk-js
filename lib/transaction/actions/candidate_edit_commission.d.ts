/// <reference types="bn.js" />
/// <reference types="node" />
import { TransactionType } from '../internal';
import { Action } from './action';
import { RlpSchemaField } from '../../util/define-properties';
import { BN } from '../../util/external';
/**
 *
 */
export interface EditCandidateCommissioActionParams {
    publicKey: string;
    commission: number | BN;
}
/**
 *
 */
export declare class EditCandidateCommissionAction extends Action {
    static readonly txType = TransactionType.EDIT_CANDIDATE_COMMISSION;
    commission: Buffer;
    publicKey: Buffer;
    constructor(data?: string | Buffer | EditCandidateCommissioActionParams);
    rlpSchema(): RlpSchemaField[];
}
