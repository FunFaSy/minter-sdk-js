/// <reference types="node" />
import { TransactionType } from '../internal';
import { Action } from './action';
import { RlpSchemaField } from '../../util/define-properties';
/**
 *
 */
export interface EditCandidateActionParams {
    publicKey: string;
    ownerAddress: string;
    controlAddress: string;
    rewardAddress: string;
}
/**
 *
 */
export declare class EditCandidateAction extends Action {
    static readonly txType = TransactionType.EDIT_CANDIDATE;
    ownerAddress: Buffer;
    controlAddress: Buffer;
    rewardAddress: Buffer;
    publicKey: Buffer;
    constructor(data?: string | Buffer | EditCandidateActionParams);
    rlpSchema(): RlpSchemaField[];
}
