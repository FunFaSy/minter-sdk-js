/// <reference types="bn.js" />
/// <reference types="node" />
import { BN } from '../../util';
import { TransactionType } from '../internal';
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
    static readonly txType = TransactionType.SELL_ALL_SWAP_POOL;
    coins: Buffer[];
    minimumValueToBuy: Buffer;
    constructor(data?: string | Buffer | SellAllSwapActionParams);
    rlpSchema(): RlpSchemaField[];
}
