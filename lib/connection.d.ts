import { Provider } from './providers';
import { ChainId } from './chain/types';
/**
 *
 */
export interface ConnectionConfig {
    chainId: string | ChainId;
    provider: {
        type: string;
        args: any;
    };
}
/**
 * Connects an account to a given network via a given provider
 */
export declare class Connection {
    readonly chainId: ChainId;
    readonly provider: Provider;
    constructor(chainId: ChainId, provider: Provider);
    /**
     * @param config Contains connection info details
     */
    static fromConfig(config: ConnectionConfig): Connection;
}
