/// <reference types="bn.js" />
/// <reference types="node" />
import { BN } from '../../util';
import { Action } from './action';
import { RlpSchemaField } from '../../util/define-properties';
/**
 *
 */
export interface BuySwapActionParams {
    coins: number[] | BN[];
    valueToBuy: string | BN;
    maximumValueToSell?: string | BN;
}
/**
 *
 */
export declare class BuySwapAction extends Action {
    coins: Buffer[];
    valueToBuy: Buffer;
    maximumValueToSell: Buffer;
    constructor(params: BuySwapActionParams);
    rlpSchema(): RlpSchemaField[];
}
