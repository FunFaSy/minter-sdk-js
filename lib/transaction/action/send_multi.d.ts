/// <reference types="node" />
import { TransactionType } from '../transaction';
import { Action } from './action';
import { RlpSchemaField } from '../../util/define-properties';
import { SendAction } from './send';
/**
 *
 */
export interface MultiSendActionParams {
    list: SendAction[];
}
/**
 *
 */
export declare class MultiSendAction extends Action {
    static readonly txType = TransactionType.MULTISEND;
    list: Buffer[];
    constructor(params: MultiSendActionParams);
    rlpSchema(): RlpSchemaField[];
}
