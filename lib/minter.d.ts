import { Connection } from './connection';
import { HttpTransportConfig } from './transport/http-transport';
import { ChainId } from './chain/types';
import { Chain } from './chain/chain';
import { Wallet } from './wallet';
import { Provider } from './providers';
/**
 *
 */
export interface MinterConfig {
    /**
     *
     */
    chainId: string | ChainId;
    /**
     * Minter RPC API url. used to make JSON RPC calls to interact with Minter.
     * @see {@link JsonRpcProvider}
     */
    nodeUrl?: string;
    /**
     *
     */
    rpcConfig?: HttpTransportConfig;
    /**
     * Minter wallet url used to redirect users to their wallet in browser applications.
     * @see {@link https://}
     */
    walletUrl?: string;
}
/**
 * This is the main class developers should use to interact with Minter.
 * @example
 * ```js
 * ```
 */
export declare class Minter {
    readonly config: MinterConfig;
    readonly chain: Chain;
    readonly connection: Connection;
    constructor(config: Partial<MinterConfig>);
    /**
     *
     */
    get rpc(): Provider;
    /**
     *
     * @param params
     * @param walletId
     */
    walletFrom(params: {
        mnemonic?: string;
        seed?: string;
    }, walletId?: number): Promise<Wallet>;
    /**
     *
     */
    newWallet(): Promise<{
        wall: Wallet;
        mnemonic: string;
    }>;
}
