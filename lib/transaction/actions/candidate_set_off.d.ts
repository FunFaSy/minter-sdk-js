/// <reference types="node" />
import { TransactionType } from '../internal';
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
    constructor(data?: string | Buffer | SetCandidateOffActionParams);
    rlpSchema(): RlpSchemaField[];
}
