/// <reference types="node" />
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
