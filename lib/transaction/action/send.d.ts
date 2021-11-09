/// <reference types="bn.js" />
/// <reference types="node" />
import { BN, RlpSchemaField } from '../../util';
import { Action } from './base_action';
/**
 *
 */
export interface SendActionParams {
    to: string;
    coin: number | BN;
    value: string | BN;
}
/**
 *
 */
export declare class SendAction extends Action {
    coin: Buffer;
    to: Buffer;
    value: Buffer;
    constructor(params: SendActionParams);
    rlpSchema(): RlpSchemaField[];
}
