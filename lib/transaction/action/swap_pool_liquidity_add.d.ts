/// <reference types="bn.js" />
/// <reference types="node" />
import { BN } from '../../util';
import { Action } from './action';
import { RlpSchemaField } from '../../util/define-properties';
/**
 *
 */
export interface AddLiquidityActionParams {
    coin0: number | BN;
    coin1: number | BN;
    volume0: string | BN;
    maximumVolume1?: string | BN;
}
/**
 *
 */
export declare class AddLiquidityAction extends Action {
    coin0: Buffer;
    coin1: Buffer;
    volume0: Buffer;
    maximumVolume1: Buffer;
    constructor(params: AddLiquidityActionParams);
    rlpSchema(): RlpSchemaField[];
}
