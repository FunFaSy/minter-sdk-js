/// <reference types="bn.js" />
/// <reference types="node" />
import { TransactionType } from '../internal';
import { Action } from './action';
import { RlpSchemaField } from '../../util/define-properties';
import { BN } from '../../util/external';
/**
 *
 */
export interface VoteNetUpdateActionParams {
    publicKey: string;
    height: number | BN;
    version: string;
}
/**
 *
 */
export declare class VoteNetUpdateAction extends Action {
    static readonly txType = TransactionType.VOTE_UPDATE;
    publicKey: Buffer;
    height: Buffer;
    version: Buffer;
    constructor(data?: string | Buffer | VoteNetUpdateActionParams);
    rlpSchema(): RlpSchemaField[];
}
