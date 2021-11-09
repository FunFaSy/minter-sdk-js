/**
 * MINTER RPC API request types and responses
 * @module
 */
import { NodeStatusResult } from './types';
declare type BlockHash = string;
declare type BlockHeight = number;
export declare type BlockId = BlockHash | BlockHeight;
export declare type Finality = 'final';
export declare type BlockReference = {
    blockId: BlockId;
} | {
    finality: Finality;
} | {
    sync_checkpoint: 'genesis' | 'earliest_available' | 'latest';
};
export interface Coin {
    id: number;
    symbol: string;
}
export interface TransactionResponse {
    hash: string;
    raw_tx: string;
    height: string;
    index: string;
    from: string;
    nonce: string;
    gas: string;
    gas_price: string;
    gas_coin: string;
    type: string;
    data: any;
    payload: string;
    tags: {
        [key: string]: any;
    };
    code: string;
    log: string;
}
/** @hidden (@link https://github.com/MinterTeam/node-grpc-gateway/blob/master/api.proto)*/
export declare abstract class Provider {
    abstract status(): Promise<NodeStatusResult>;
}
export {};
/** @hidden */
