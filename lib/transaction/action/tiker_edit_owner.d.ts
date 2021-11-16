/// <reference types="node" />
import { TransactionType } from '../transaction';
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
    constructor(params: EditTickerOwnerActionParams);
    /**
     *
     */
    rlpSchema(): RlpSchemaField[];
}
