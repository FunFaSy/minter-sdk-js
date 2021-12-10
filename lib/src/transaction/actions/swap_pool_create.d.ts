/// <reference types="bn.js" />
/// <reference types="node" />
import { BN } from '../../util';
import { TransactionType } from '../internal';
import { Action } from './action';
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
    static readonly txType = TransactionType.CREATE_SWAP_POOL;
    coin0: Buffer;
    coin1: Buffer;
    volume0: Buffer;
    volume1: Buffer;
    constructor(data?: string | Buffer | CreateSwapPoolActionParams);
    /**
     *
     */
    rlpSchema(): RlpSchemaField[];
}
