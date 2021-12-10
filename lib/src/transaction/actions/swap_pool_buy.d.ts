/// <reference types="bn.js" />
/// <reference types="node" />
import { BN } from '../../util';
import { TransactionType } from '../internal';
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
    static readonly txType = TransactionType.BUY_SWAP_POOL;
    coins: Buffer[];
    valueToBuy: Buffer;
    maximumValueToSell: Buffer;
    constructor(data?: string | Buffer | BuySwapActionParams);
    rlpSchema(): RlpSchemaField[];
}
