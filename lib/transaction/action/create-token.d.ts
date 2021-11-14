/// <reference types="bn.js" />
/// <reference types="node" />
import { BN } from '../../util';
import { Action } from './base_action';
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
    name: Buffer;
    symbol: Buffer;
    initialAmount: Buffer;
    maxSupply?: Buffer;
    mintable?: Buffer;
    burnable?: Buffer;
    /**
     *
     * @param params
     */
    constructor(params: CreateTokenActionParams);
    /**
     *
     */
    rlpSchema(): RlpSchemaField[];
}
