/// <reference types="bn.js" />
/// <reference types="node" />
import { BN } from '../../util';
import { TransactionType } from '../internal';
import { Action } from './action';
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
    static readonly txType = TransactionType.SELL_SWAP_POOL;
    coins: Buffer[];
    valueToSell: Buffer;
    minimumValueToBuy: Buffer;
    constructor(data?: string | Buffer | SellSwapActionParams);
    rlpSchema(): RlpSchemaField[];
}
