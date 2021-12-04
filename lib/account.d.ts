import { Connection } from './connection';
export interface AccountState {
    balance?: {
        bip_value: string;
        coin: {
            id: string;
            symbol: string;
        };
        value: string;
    }[];
    delegated?: {
        bip_value: string;
        coin: {
            id: string;
            symbol: string;
        };
        value: string;
    }[];
    total?: {
        bip_value: string;
        coin: {
            id: string;
            symbol: string;
        };
        value: string;
    }[];
    transaction_count?: string;
    bip_value?: string;
    multisig?: boolean;
}
export declare class Account {
    readonly connection: Connection;
    readonly accountId: string;
    constructor(connection: Connection, accountId: string);
    state(): Promise<AccountState>;
}
