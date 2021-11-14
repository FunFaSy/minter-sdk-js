/// <reference types="bn.js" />
/// <reference types="node" />
import { Action } from './base_action';
import { RlpSchemaField } from '../../util/define-properties';
import { BN } from '../../util/external';
/**
 *
 */
export interface VoteNetUpdateActionParams {
    publicKey: string;
    height: number | BN;
    version: string;
}
/**
 *
 */
export declare class VoteNetUpdateAction extends Action {
    publicKey: Buffer;
    height: Buffer;
    version: Buffer;
    constructor(params: VoteNetUpdateActionParams);
    rlpSchema(): RlpSchemaField[];
}
