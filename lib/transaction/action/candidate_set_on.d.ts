/// <reference types="node" />
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
    publicKey: Buffer;
    constructor(params: SetCandidateOnActionParams);
    rlpSchema(): RlpSchemaField[];
}
