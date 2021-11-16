/// <reference types="node" />
import { TransactionType } from '../internal';
import { Action } from './action';
import { RlpSchemaField } from '../../util/define-properties';
/**
 *
 */
export interface EditTickerOwnerActionParams {
    newOwner: string;
    symbol: string;
}
/**
 *
 */
export declare class EditTickerOwnerAction extends Action {
    static readonly txType = TransactionType.EDIT_TICKER_OWNER;
    symbol: Buffer;
    newOwner: Buffer;
    /**
     *
     * @param params
     */
    constructor(data?: string | Buffer | EditTickerOwnerActionParams);
    /**
     *
     */
    rlpSchema(): RlpSchemaField[];
}
