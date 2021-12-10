/// <reference types="node" />
import { TransactionType } from '../internal';
import { Action } from './action';
import { RlpSchemaField } from '../../util/define-properties';
/**
 *
 */
export interface SetCandidateOnActionParams {
    publicKey: string;
}
/**
 *
 */
export declare class SetCandidateOnAction extends Action {
    static readonly txType = TransactionType.SET_CANDIDATE_ON;
    publicKey: Buffer;
    constructor(data?: string | Buffer | SetCandidateOnActionParams);
    rlpSchema(): RlpSchemaField[];
}
