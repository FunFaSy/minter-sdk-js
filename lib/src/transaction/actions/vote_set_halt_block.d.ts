/// <reference types="bn.js" />
/// <reference types="node" />
import { TransactionType } from '../internal';
import { Action } from './action';
import { RlpSchemaField } from '../../util/define-properties';
import { BN } from '../../util/external';
/**
 *
 */
export interface VoteHaltBlockActionParams {
    publicKey: string;
    height: number | BN;
}
/**
 *
 */
export declare class VoteHaltBlockAction extends Action {
    static readonly txType = TransactionType.SET_HALT_BLOCK;
    publicKey: Buffer;
    height: Buffer;
    constructor(data?: string | Buffer | VoteHaltBlockActionParams);
    rlpSchema(): RlpSchemaField[];
}
