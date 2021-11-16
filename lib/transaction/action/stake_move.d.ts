/// <reference types="bn.js" />
/// <reference types="node" />
import { TransactionType } from '../transaction';
import { Action } from './action';
import { RlpSchemaField } from '../../util/define-properties';
import { BN } from '../../util/external';
/**
 *
 */
export interface MoveStakeActionParams {
    from: string;
    to: string;
    coin: number | BN;
    stake: string | BN;
}
/**
 *
 */
export declare class MoveStakeAction extends Action {
    static readonly txType = TransactionType.MOVE_STAKE;
    coin: Buffer;
    stake: Buffer;
    from: Buffer;
    to: Buffer;
    constructor(params: MoveStakeActionParams);
    rlpSchema(): RlpSchemaField[];
}
