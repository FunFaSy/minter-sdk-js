/// <reference types="bn.js" />
/// <reference types="node" />
import { Action } from './action';
import { RlpSchemaField } from '../../util/define-properties';
import { BN } from '../../util/external';
/**
 *
 */
export interface EditCandidateCommissioActionParams {
    publicKey: string;
    commission: number | BN;
}
/**
 *
 */
export declare class EditCandidateCommissionAction extends Action {
    commission: Buffer;
    publicKey: Buffer;
    constructor(params: EditCandidateCommissioActionParams);
    rlpSchema(): RlpSchemaField[];
}
