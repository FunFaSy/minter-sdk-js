/// <reference types="node" />
import { Action } from './base_action';
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
    publicKey: Buffer;
    constructor(params: SetCandidateOffActionParams);
    rlpSchema(): RlpSchemaField[];
}
