/// <reference types="bn.js" />
/// <reference types="node" />
import { BN } from '../../util';
import { Action } from './action';
import { RlpSchemaField } from '../../util/define-properties';
/**
 *
 */
export interface SellAllSwapActionParams {
    coins: number[] | BN[];
    minimumValueToBuy?: string | BN;
}
/**
 *
 */
export declare class SellAllSwapAction extends Action {
    coins: Buffer[];
    minimumValueToBuy: Buffer;
    constructor(params: SellAllSwapActionParams);
    rlpSchema(): RlpSchemaField[];
}
