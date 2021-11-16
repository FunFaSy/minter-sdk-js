/// <reference types="bn.js" />
/// <reference types="node" />
import { BN } from '../../util';
import { TransactionType } from '../internal';
import { Action } from './action';
import { RlpSchemaField } from '../../util/define-properties';
/**
 *
 */
export interface SellActionParams {
    coinToSell: number | BN;
    coinToBuy: number | BN;
    valueToSell: string | BN;
    minimumValueToBuy?: string | BN;
}
/**
 *
 */
export declare class SellAction extends Action {
    static readonly txType = TransactionType.SELL;
    coinToSell: Buffer;
    valueToSell: Buffer;
    coinToBuy: Buffer;
    minimumValueToBuy: Buffer;
    constructor(data?: string | Buffer | SellActionParams);
    rlpSchema(): RlpSchemaField[];
}
