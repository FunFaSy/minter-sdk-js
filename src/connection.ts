import {JsonRpcProvider, Provider} from './providers';
import {InMemorySigner, Signer} from './signer';
import {InMemoryKeyStore, KeyStore} from './key_stores';

/**
 * @param config Contains connection info details
 * @returns {Provider}
 */
function getProvider(config: { type: string; args: any }): Provider {
    switch (config.type) {
    case undefined:
        return undefined;
    case 'JsonRpcProvider':
        return new JsonRpcProvider(config.args.url);
    default:
        throw new Error(`Unknown provider type ${config.type}`);
    }
}

/**
 * @param config Contains connection info details
 * @returns {Signer}
 */
function getSigner(config: { type: string; keyStore: KeyStore }): Signer {
    switch (config.type) {
    case undefined:
        return undefined;
    case 'InMemorySigner': {
        return new InMemorySigner(config.keyStore as InMemoryKeyStore);
    }
    default:
        throw new Error(`Unknown signer type ${config.type}`);
    }
}

/**
 *
 */
export interface ConnectionConfig {
    networkId: string | number;
    provider: { type: string; args: any };
    signer: { type: string; keyStore: KeyStore };
}

/**
 * Connects an account to a given network via a given provider
 */
export class Connection {
    readonly networkId: string | number;
    readonly provider: Provider;
    readonly signer: Signer;

    constructor(networkId: string | number, provider: Provider, signer: Signer) {
        this.networkId = networkId;
        this.provider = provider;
        this.signer = signer;
    }

    /**
     * @param config Contains connection info details
     */
    static fromConfig(config: ConnectionConfig): Connection {
        const provider = getProvider(config.provider);
        const signer = getSigner(config.signer);
        return new Connection(config.networkId, provider, signer);
    }
}
