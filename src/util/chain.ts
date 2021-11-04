import {BootstrapNode, ChainInitialParams, GenesisBlock} from './chain/types';
import * as mainNetParams from './chain/mainnet.json';
import * as tacoNetParams from './chain/mainnet.json';
import {Assignable} from './types';
import {isNumber, isString} from './functions/type';

export * from './chain/types';

export class ChainParams extends Assignable implements ChainInitialParams {
    bootstrapNodes: BootstrapNode[];
    chainId: number;
    comment: string;
    genesis: GenesisBlock;
    name: string;
    networkId: number;
    url: string;
    blockMaxBytes: number;
    blockMaxGas: number;
    blockTimeIotaMs: number;
    initialHeight: number;
    totalSlashed: number;
}

/**
 * Chain class to access chain parameters
 */
export default class Chain {
    private _chainParams: ChainParams;

    /**
     * Creates a Common object for a custom chain, based on a standard one. It uses all the [[Chain]]
     * params from [[baseChain]] except the ones overridden in [[customChainParams]].
     *
     * @param baseChain The name (`mainnet`) or id (`1`) of a standard chain used to base the custom
     * chain params on.
     * @param customChainParams The custom parameters of the chain.
     */
    static forCustomChain(baseChain: string | number, customChainParams: Partial<ChainInitialParams>): Chain {
        //const params = new ChainParams(customChainParams);
        let baseChainParams;
        if (isString(baseChain)) {
            switch (baseChain) {
            case 'taco':
                baseChainParams = tacoNetParams;
                break;
            default:
                baseChainParams = mainNetParams;
                break;
            }
        }
        const params = new ChainParams(Object.assign({}, baseChainParams, customChainParams));

        return new Chain(params);
    }

    /**
     * @constructor
     * @param chain String ('mainnet') or Number (1) or Dictionary with chain params
     */
    constructor(chain: string | number | object) {
        let params: ChainParams;
        if (isString(chain)) {
            switch (chain) {
            case 'taco':
                params = (tacoNetParams as undefined) as ChainParams;
                break;
            default:
                params = (mainNetParams as undefined) as ChainParams;
                break;
            }
        } else if (isNumber(chain)) {
            switch (chain) {
            case tacoNetParams.networkId:
                params = (tacoNetParams as undefined) as ChainParams;
                break;
            default:
                params = (mainNetParams as undefined) as ChainParams;
                break;
            }
        } else if (chain instanceof ChainParams) {
            params = chain;
        }

        this._chainParams = params as ChainInitialParams;
    }

    /**
     * Sets the chain
     * @param chain String ('mainnet') or Number (1) chain representation.
     * Or, a Dictionary of chain parameters for a private network.
     * @returns The dictionary with parameters set as chain
     */
    setChain(chain: string | number | object): any {
        return this;
    }

    /**
     * Returns the Genesis parameters of current chain
     * @returns Genesis dictionary
     */
    genesis(): GenesisBlock {
        return this._chainParams.genesis;
    }

    /**
     * Returns bootstrap nodes for the current chain
     * @returns {Dictionary} Dict with bootstrap nodes
     */
    bootstrapNodes(): BootstrapNode[] {
        return this._chainParams.bootstrapNodes;
    }

    /**
     * Returns the Id of current chain
     * @returns chain Id
     */
    id(): number {
        return this._chainParams.chainId;
    }

    /**
     * Returns the name of current chain
     * @returns chain name (lower case)
     */
    name(): string {
        return this._chainParams.name;
    }

    /**
     * Returns the Id of current network
     * @returns network Id
     */
    networkId(): number {
        return this._chainParams.networkId;
    }
}
