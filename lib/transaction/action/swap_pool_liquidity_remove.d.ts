/// <reference types="bn.js" />
/// <reference types="node" />
import { BN } from '../../util';
import { TransactionType } from '../transaction';
import { Action } from './action';
import { RlpSchemaField } from '../../util/define-properties';
/**
 *
 */
export interface RemoveLiquidityActionParams {
    coin0: number | BN;
    coin1: number | BN;
    liquidity: string | BN;
    minimumVolume0?: string | BN;
    minimumVolume1?: string | BN;
}
/**
 *
 */
export declare class RemoveLiquidityAction extends Action {
    static readonly txType = TransactionType.REMOVE_LIQUIDITY;
    coin0: Buffer;
    coin1: Buffer;
    liquidity: Buffer;
    minimumVolume0: Buffer;
    minimumVolume1: Buffer;
    constructor(params: RemoveLiquidityActionParams);
    rlpSchema(): RlpSchemaField[];
}
