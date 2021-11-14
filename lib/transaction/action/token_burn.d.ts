/// <reference types="bn.js" />
/// <reference types="node" />
import { BN } from '../../util';
import { Action } from './action';
import { RlpSchemaField } from '../../util/define-properties';
/**
 *
 */
export interface BurnTokenActionParams {
    coin: number | BN;
    value: string | BN;
}
/**
 *
 */
export declare class BurnTokenAction extends Action {
    coin: Buffer;
    value: Buffer;
    constructor(params: BurnTokenActionParams);
    rlpSchema(): RlpSchemaField[];
}
