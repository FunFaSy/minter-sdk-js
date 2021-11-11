/// <reference types="bn.js" />
/// <reference types="node" />
import { BN } from '../../util';
import { Action } from './base_action';
import { RlpSchemaField } from '../../util/define-properties';
/**
 *
 */
export interface SellAllActionParams {
    coinToSell: number | BN;
    coinToBuy: number | BN;
    minimumValueToBuy?: string | BN;
}
/**
 *
 */
export declare class SellAllAction extends Action {
    coinToSell: Buffer;
    coinToBuy: Buffer;
    minimumValueToBuy: Buffer;
    constructor(params: SellAllActionParams);
    rlpSchema(): RlpSchemaField[];
}
