import {JsonRpcProvider, Provider} from './providers';
import {ChainId} from './chain/types';

/**
 * @param config Contains connection info details
 * @returns {Provider}
 */
function getProvider(config: { type: string; args: any }): Provider {
  switch (config.type) {
  case undefined:
    return undefined;
  case 'JsonRpcProvider':
    return new JsonRpcProvider(config.args.providerConfig || config.args.url);
  default:
    throw new Error(`Unknown provider type ${config.type}`);
  }
}

/**
 *
 */
export interface ConnectionConfig {
    chainId: string | ChainId;
    provider: { type: string; args: any };
}

/**
 * Connects an account to a given network via a given provider
 */
export class Connection {
    readonly chainId: ChainId;
    readonly provider: Provider; //

    constructor(chainId: ChainId, provider: Provider) {
      this.chainId = chainId;
      this.provider = provider;
    }

    /**
     * @param config Contains connection info details
     */
    static fromConfig(config: ConnectionConfig): Connection {
      const provider = getProvider(config.provider);
      return new Connection(config.chainId as ChainId, provider);
    }
}
