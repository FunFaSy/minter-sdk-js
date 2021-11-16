/// <reference types="bn.js" />
/// <reference types="node" />
import { BN } from '../../util';
import { TransactionType } from '../internal';
import { Action } from './action';
import { RlpSchemaField } from '../../util/define-properties';
/**
 *
 */
export interface CreateTokenActionParams {
    name: string;
    symbol: string;
    initialAmount: string | BN;
    maxSupply: string | BN;
    mintable?: boolean;
    burnable?: boolean;
}
/**
 *
 */
export declare class CreateTokenAction extends Action {
    static readonly txType = TransactionType.CREATE_TOKEN;
    name: Buffer;
    symbol: Buffer;
    initialAmount: Buffer;
    maxSupply?: Buffer;
    mintable?: Buffer;
    burnable?: Buffer;
    constructor(data?: string | Buffer | CreateTokenActionParams);
    /**
     *
     */
    rlpSchema(): RlpSchemaField[];
}
