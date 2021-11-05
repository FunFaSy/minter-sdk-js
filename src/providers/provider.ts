/**
 * MINTER RPC API request types and responses
 * @module
 */

type BlockHash = string;
type BlockHeight = number;
export type BlockId = BlockHash | BlockHeight;

export type Finality = 'final'

export type BlockReference =
    { blockId: BlockId }
    | { finality: Finality }
    | { sync_checkpoint: 'genesis' | 'earliest_available' | 'latest' }

// Resources (@link (https://github.com/MinterTeam/node-grpc-gateway/blob/master/resources.proto)
export interface Coin {
    id: number;
    symbol: string;
}

// RPC Entities

//

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
    tags: { [key: string]: any };
    code: string;
    log: string;
}

/** @hidden (@link https://github.com/MinterTeam/node-grpc-gateway/blob/master/api.proto)*/
export abstract class Provider {

    // rpc Halts (HaltsRequest) returns (HaltsResponse)
    //
    // // Blockchain
    //
    // abstract netInfo(): Promise<NodeNetInfoResult>;
    //
    // abstract status(): Promise<NodeStatusResult>;
    //
    // abstract block(params: BlockRequest): Promise<NodeStatusResult>;
    //
    // // WebSockets
    // // abstract  Subscribe (SubscribeRequest) returns (stream SubscribeResponse)
    //
    // // MinGasPrice
    // abstract MinGasPrice(): Promise<NodeStatusResult>;
    //
    // abstract sendTransaction(signedTransaction: SignedTransaction): Promise<FinalExecutionOutcome>;
    //
    // abstract sendTransactionAsync(signedTransaction: SignedTransaction): Promise<FinalExecutionOutcome>;
    //
    // abstract txStatus(txHash: Uint8Array | string): Promise<FinalExecutionOutcome>;
    //
    // abstract query<T extends QueryResponseKind>(params: RpcQueryRequest): Promise<T>;
    // abstract query<T extends QueryResponseKind>(path: string, data: string): Promise<T>;

}

/** @hidden */
// export function getTransactionLastResult(txResult: FinalExecutionOutcome): any {
//     if (typeof txResult.status === 'object' && typeof txResult.status.SuccessValue === 'string') {
//         const value = Buffer.from(txResult.status.SuccessValue, 'base64').toString();
//         try {
//             return JSON.parse(value);
//         }
//         catch (e) {
//             return value;
//         }
//     }
//     return null;
// }

