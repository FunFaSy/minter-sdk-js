import {BootstrapNode, ChainInitialParams, GenesisBlock} from './chain/types';
import * as mainNetParams from './chain/mainnet.json';
import * as tacoNetParams from './chain/taconet.json';
import * as testNetParams from './chain/testnet.json';

import {deepExtend} from './util';
import {Assignable} from './util/types';
import {isNumber, isString} from './util/functions/type';

export * from './chain/types';

export class ChainParams extends Assignable implements ChainInitialParams {
    bootstrapNodes: BootstrapNode[];
    chainId: number;
    comment: string;
    genesis: GenesisBlock;
    name: string;
    networkId: number;
    gasCoin: number;
    blockMaxBytes: number;
    blockMaxGas: number;
    blockTimeIotaMs: number;
    initialHeight: number;
    totalSlashed: number;
    urls: { [p: string]: any };
}

/**
 * Chain class to access chain parameters
 */
export default class Chain {
    private _chainParams: ChainParams;

    describe() {
        return this._chainParams;
    }

    /**
     * Creates a Common object for a custom chain, based on a standard one. It uses all the [[Chain]]
     * params from [[baseChain]] except the ones overridden in [[customChainParams]].
     *
     * @param baseChain The name (`mainnet`) or id (`1`) of a standard chain used to base the custom
     * chain params on.
     * @param userConfig The custom parameters of the chain.
     */
    static forCustomChain(baseChain: string | number, userConfig: Partial<ChainInitialParams>): Chain {
        const baseConfig = Chain.getBaseParams(baseChain);
        const configEntries = deepExtend({}, baseConfig, userConfig);
        const params = new ChainParams(configEntries);

        return new Chain(params);
    }

    static getBaseParams(chain: string | number | object): ChainParams {
        let baseConfig: ChainParams;

        if (isString(chain)) {
            switch (chain) {
            case 'mainnet':
                baseConfig = (mainNetParams as undefined) as ChainParams;
                break;
            case 'testnet':
                baseConfig = (testNetParams as undefined) as ChainParams;
                break;
            case 'taconet':
                baseConfig = (tacoNetParams as undefined) as ChainParams;
                break;
            default:
                throw new Error(`Unknown chainId ${chain}`);
            }
        }
        //
        else if (isNumber(chain)) {
            switch (chain) {
            case mainNetParams.networkId:
                baseConfig = (mainNetParams as undefined) as ChainParams;
                break;
            case testNetParams.networkId:
                baseConfig = (testNetParams as undefined) as ChainParams;
                break;
            case tacoNetParams.networkId:
                baseConfig = (tacoNetParams as undefined) as ChainParams;
                break;
            default:
                throw new Error(`Unknown networkId ${chain}`);
            }
        }
        //
        else if (chain instanceof ChainParams) {
            baseConfig = chain;
        }
        return baseConfig;
    }

    /**
     * @constructor
     * @param chain String ('mainnet') or Number (1) or Dictionary with chain params
     */
    constructor(chain: string | number | object) {
        this._chainParams =  Chain.getBaseParams(chain);

        const configEntries = Object.entries(this._chainParams);
        for (let i = 0; i < configEntries.length; i++) {
            const [property, value] = configEntries[i];
            if (value && Object.getPrototypeOf(value) === Object.prototype) {
                this[property] = deepExtend(this[property], value);
            } else {
                this[property] = value;
            }
        }

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
     * Returns the name of current chain
     * @returns chain name (lower case)
     */
    name(): string {
        return this._chainParams.name.toLowerCase();
    }

    /**
     * Returns the Id of current chain
     * @returns chain Id
     */
    id(): number {
        return this._chainParams.chainId;
    }

    /**
     * Returns the Id of current network
     * @returns network Id
     */
    networkId(): number {
        return this._chainParams.networkId;
    }

    /**
     * Returns the Id of gasCoin for current network
     * @returns gasCoin Id
     */
    gasCoin(): number {
        return this._chainParams.gasCoin;
    }
}
