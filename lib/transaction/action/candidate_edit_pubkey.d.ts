/// <reference types="node" />
import { TransactionType } from '../transaction';
import { Action } from './action';
import { RlpSchemaField } from '../../util/define-properties';
/**
 *
 */
export interface EditCandidatePubKeyActionParams {
    publicKey: string;
    newPublicKey: string;
}
/**
 *
 */
export declare class EditCandidatePubKeyAction extends Action {
    static readonly txType = TransactionType.EDIT_CANDIDATE_PUBLIC_KEY;
    newPublicKey: Buffer;
    publicKey: Buffer;
    constructor(params: EditCandidatePubKeyActionParams);
    rlpSchema(): RlpSchemaField[];
}
