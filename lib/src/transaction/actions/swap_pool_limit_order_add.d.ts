/// <reference types="bn.js" />
/// <reference types="node" />
import { BN } from '../../util';
import { TransactionType } from '../internal';
import { Action } from './action';
import { RlpSchemaField } from '../../util/define-properties';
/**
 *
 */
export interface AddLimitOrderActionParams {
    coinToSell: number | BN;
    valueToSell: string | BN;
    coinToBuy: number | BN;
    valueToBuy: string | BN;
}
/**
 *
 */
export declare class AddLimitOrderAction extends Action {
    static readonly txType = TransactionType.ADD_LIMIT_ORDER;
    coinToSell: Buffer;
    valueToSell: Buffer;
    coinToBuy: Buffer;
    valueToBuy: Buffer;
    constructor(data?: string | Buffer | AddLimitOrderActionParams);
    rlpSchema(): RlpSchemaField[];
}
