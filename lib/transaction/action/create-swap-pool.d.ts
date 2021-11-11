/// <reference types="bn.js" />
/// <reference types="node" />
import { BN } from '../../util';
import { Action } from './base_action';
import { RlpSchemaField } from '../../util/define-properties';
/**
 *
 */
export interface CreateSwapPoolActionParams {
    coin0: number | BN;
    coin1: number | BN;
    volume0: string | BN;
    volume1: string | BN;
}
/**
 *
 */
export declare class CreateSwapPoolAction extends Action {
    coin0: Buffer;
    coin1: Buffer;
    volume0: Buffer;
    volume1: Buffer;
    /**
     *
     * @param params
     */
    constructor(params: CreateSwapPoolActionParams);
    /**
     *
     */
    rlpSchema(): RlpSchemaField[];
}
