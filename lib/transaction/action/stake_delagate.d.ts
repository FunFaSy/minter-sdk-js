/// <reference types="bn.js" />
/// <reference types="node" />
import { Action } from './action';
import { RlpSchemaField } from '../../util/define-properties';
import { BN } from '../../util/external';
/**
 *
 */
export interface DelegateActionParams {
    publicKey: string;
    coin: number | BN;
    stake: string | BN;
}
/**
 *
 */
export declare class DelegateAction extends Action {
    coin: Buffer;
    stake: Buffer;
    publicKey: Buffer;
    constructor(params: DelegateActionParams);
    rlpSchema(): RlpSchemaField[];
}
