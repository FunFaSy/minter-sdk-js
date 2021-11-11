/// <reference types="node" />
import { Action } from './base_action';
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
    list: Buffer[];
    constructor(params: MultiSendActionParams);
    rlpSchema(): RlpSchemaField[];
}
