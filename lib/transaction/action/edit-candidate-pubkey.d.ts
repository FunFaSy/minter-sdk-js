/// <reference types="node" />
import { Action } from './base_action';
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
    newPublicKey: Buffer;
    publicKey: Buffer;
    constructor(params: EditCandidatePubKeyActionParams);
    rlpSchema(): RlpSchemaField[];
}
