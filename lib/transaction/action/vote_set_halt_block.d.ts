/// <reference types="bn.js" />
/// <reference types="node" />
import { Action } from './action';
import { RlpSchemaField } from '../../util/define-properties';
import { BN } from '../../util/external';
/**
 *
 */
export interface VoteHaltBlockActionParams {
    publicKey: string;
    height: number | BN;
}
/**
 *
 */
export declare class VoteHaltBlockAction extends Action {
    publicKey: Buffer;
    height: Buffer;
    constructor(params: VoteHaltBlockActionParams);
    rlpSchema(): RlpSchemaField[];
}
