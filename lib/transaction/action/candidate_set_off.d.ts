/// <reference types="node" />
import { TransactionType } from '../transaction';
import { Action } from './action';
import { RlpSchemaField } from '../../util/define-properties';
/**
 *
 */
export interface SetCandidateOffActionParams {
    publicKey: string;
}
/**
 *
 */
export declare class SetCandidateOffAction extends Action {
    static readonly txType = TransactionType.SET_CANDIDATE_OFF;
    publicKey: Buffer;
    constructor(params: SetCandidateOffActionParams);
    rlpSchema(): RlpSchemaField[];
}
