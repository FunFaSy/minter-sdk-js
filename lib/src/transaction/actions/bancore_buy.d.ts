/// <reference types="bn.js" />
/// <reference types="node" />
import { BN } from '../../util';
import { RlpSchemaField } from '../../util/define-properties';
import { TransactionType } from '../internal';
import { Action } from './action';
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
    constructor(data?: string | Buffer | BuyActionParams);
    rlpSchema(): RlpSchemaField[];
}
