/// <reference types="bn.js" />
/// <reference types="node" />
import { Action } from './base_action';
import { RlpSchemaField } from '../../util/define-properties';
import { BN } from '../../util/external';
/**
 *
 */
export interface MoveStakeActionParams {
    from: string;
    to: string;
    coin: number | BN;
    stake: string | BN;
}
/**
 *
 */
export declare class MoveStakeAction extends Action {
    coin: Buffer;
    stake: Buffer;
    from: Buffer;
    to: Buffer;
    constructor(params: MoveStakeActionParams);
    rlpSchema(): RlpSchemaField[];
}
