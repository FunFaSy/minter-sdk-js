/// <reference types="node" />
import { BNLike, BufferLike } from './util';
import { Connection } from './connection';
export interface AccountState {
    nonce?: BNLike;
    balance?: BufferLike;
    delegated?: BufferLike;
    total?: BufferLike;
    transaction_count?: BNLike;
    bip_value?: BNLike;
}
export declare class Account {
    readonly connection: Connection;
    readonly accountId: string;
    readonly mnemonic: Buffer;
    constructor(connection: Connection, accountId: string);
    state(): Promise<AccountState>;
}
