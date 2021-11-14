/// <reference types="node" />
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
    ownerAddress: Buffer;
    controlAddress: Buffer;
    rewardAddress: Buffer;
    publicKey: Buffer;
    constructor(params: EditCandidateActionParams);
    rlpSchema(): RlpSchemaField[];
}
