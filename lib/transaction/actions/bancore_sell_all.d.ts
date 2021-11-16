/// <reference types="bn.js" />
/// <reference types="node" />
import { BN } from '../../util';
import { TransactionType } from '../internal';
import { Action } from './action';
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
    static readonly txType = TransactionType.SELL_ALL;
    coinToSell: Buffer;
    coinToBuy: Buffer;
    minimumValueToBuy: Buffer;
    constructor(data?: string | Buffer | SellAllActionParams);
    rlpSchema(): RlpSchemaField[];
}
