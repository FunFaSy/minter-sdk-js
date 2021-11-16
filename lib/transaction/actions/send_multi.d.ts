/// <reference types="node" />
import { TransactionType } from '../internal';
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
    constructor(data?: string | Buffer | MultiSendActionParams);
    rlpSchema(): RlpSchemaField[];
}
