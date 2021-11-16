/// <reference types="bn.js" />
/// <reference types="node" />
import { BN } from '../../util';
import { TransactionType } from '../transaction';
import { Action } from './action';
import { RlpSchemaField } from '../../util/define-properties';
/**
 *
 */
export interface CreateCoinActionParams {
    name: string;
    symbol: string;
    initialAmount: string | BN;
    initialReserve: string | BN;
    constantReserveRatio: number | BN;
    maxSupply?: string | BN;
}
/**
 *
 */
export declare class CreateCoinAction extends Action {
    static readonly txType = TransactionType.CREATE_COIN;
    name: Buffer;
    symbol: Buffer;
    initialAmount: Buffer;
    initialReserve: Buffer;
    constantReserveRatio: Buffer;
    maxSupply?: Buffer;
    /**
     *
     * @param params
     */
    constructor(params: CreateCoinActionParams);
    /**
     *
     */
    rlpSchema(): RlpSchemaField[];
}
