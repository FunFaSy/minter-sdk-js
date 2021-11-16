/// <reference types="bn.js" />
/// <reference types="node" />
import { BN } from '../../util';
import { TransactionType } from '../transaction';
import { Action } from './action';
import { RlpSchemaField } from '../../util/define-properties';
/**
 *
 */
export interface BuyActionParams {
    coinToBuy: number | BN;
    coinToSell: number | BN;
    valueToBuy: string | BN;
    maximumValueToSell?: string | BN;
}
/**
 *
 */
export declare class BuyAction extends Action {
    static readonly txType = TransactionType.BUY;
    coinToBuy: Buffer;
    valueToBuy: Buffer;
    coinToSell: Buffer;
    maximumValueToSell: Buffer;
    constructor(params: BuyActionParams);
    rlpSchema(): RlpSchemaField[];
}
