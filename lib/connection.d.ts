import { Provider } from './providers';
import { Signer } from './signer';
import { KeyStore } from './key_stores';
/**
 *
 */
export interface ConnectionConfig {
    networkId: string | number;
    provider: {
        type: string;
        args: any;
    };
    signer: {
        type: string;
        keyStore: KeyStore;
    };
}
/**
 * Connects an account to a given network via a given provider
 */
export declare class Connection {
    readonly networkId: string | number;
    readonly provider: Provider;
    readonly signer: Signer;
    constructor(networkId: string | number, provider: Provider, signer: Signer);
    /**
     * @param config Contains connection info details
     */
    static fromConfig(config: ConnectionConfig): Connection;
}
