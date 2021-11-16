/// <reference types="node" />
import { TransactionType } from '../internal';
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
    constructor(data?: string | Buffer | EditCandidatePubKeyActionParams);
    rlpSchema(): RlpSchemaField[];
}
