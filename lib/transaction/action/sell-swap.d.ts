/// <reference types="bn.js" />
/// <reference types="node" />
import { BN } from '../../util';
import { Action } from './base_action';
import { RlpSchemaField } from '../../util/define-properties';
/**
 *
 */
export interface SellSwapActionParams {
    coins: number[] | BN[];
    valueToSell: string | BN;
    minimumValueToBuy?: string | BN;
}
/**
 *
 */
export declare class SellSwapAction extends Action {
    coins: Buffer[];
    valueToSell: Buffer;
    minimumValueToBuy: Buffer;
    constructor(params: SellSwapActionParams);
    rlpSchema(): RlpSchemaField[];
}
