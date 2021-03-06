/// <reference types="bn.js" />
/// <reference types="node" />
import { TransactionType } from '../internal';
import { Action } from './action';
import { RlpSchemaField } from '../../util/define-properties';
import { BN } from '../../util/external';
/**
 *
 */
export interface DelegateActionParams {
    publicKey: string;
    coin: number | BN;
    stake: string | BN;
}
/**
 *
 */
export declare class DelegateAction extends Action {
    static readonly txType = TransactionType.DELEGATE;
    coin: Buffer;
    stake: Buffer;
    publicKey: Buffer;
    constructor(data?: string | Buffer | DelegateActionParams);
    rlpSchema(): RlpSchemaField[];
}
