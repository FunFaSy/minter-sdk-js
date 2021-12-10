/// <reference types="bn.js" />
/// <reference types="node" />
import { BN } from '../../util';
import { TransactionType } from '../internal';
import { Action } from './action';
import { RlpSchemaField } from '../../util/define-properties';
/**
 *
 */
export interface DeclareCandidacyActionParams {
    address: string;
    publicKey: string;
    commission: number | BN;
    coin: number | BN;
    stake: string | BN;
}
/**
 *
 */
export declare class DeclareCandidacyAction extends Action {
    static readonly txType = TransactionType.DECLARE_CANDIDACY;
    address: Buffer;
    publicKey: Buffer;
    commission: Buffer;
    coin: Buffer;
    stake: Buffer;
    constructor(data?: string | Buffer | DeclareCandidacyActionParams);
    rlpSchema(): RlpSchemaField[];
}
