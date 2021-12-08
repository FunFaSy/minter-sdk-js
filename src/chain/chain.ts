import {BootstrapNode, ChainId, ChainParams, GenesisBlock} from './types';
import * as mainNetParams from './mainnet.json';
import * as tacoNetParams from './taconet.json';
import * as testNetParams from './testnet.json';

import {deepExtend} from '../util';
import {isNumber, isObject, isString} from '../util/functions/type';
import {Connection} from '../connection';
import {JsonRpcProvider} from '../providers';

/**
 * Chain class to access chain parameters
 */
export class Chain {
    private chainParams: ChainParams;

    /**
     * @constructor
     * @param chain String ('mainnet') or Number (1) or Dictionary with chain params
     */
    constructor(chain: string | number | ChainParams) {
        //
        if (isString(chain)) {
            this.chainParams = Chain.getBaseParams(chain.toString());
        } else if (isNumber(chain)) {
            this.chainParams = Chain.getBaseParams(Number(chain));
        } else if (isObject(chain)) {
            this.chainParams = chain as ChainParams;
        }

        // const configEntries = Object.entries(this.chainParams);
        // for (let i = 0; i < configEntries.length; i++) {
        //     const [property, value] = configEntries[i];
        //     if (value && Object.getPrototypeOf(value) === Object.prototype) {
        //         this[property] = deepExtend(this[property], value);
        //     } else {
        //         this[property] = value;
        //     }
        // }

    }

    /**
     * Creates a Chain object for a custom chain, based on a standard one. It uses all the [[ChainParams]]
     * params from [[baseChain]] except the ones overridden in [[userConfig]].
     *
     * @param baseChain The name (`mainnet`) or id (`1`) of a standard chain used to base the custom
     * chain params on.
     * @param userConfig The custom parameters of the chain.
     */
    static forCustomChain(baseChain: string | number, userConfig: Partial<ChainParams>): Chain {
        const baseConfig = Chain.getBaseParams(baseChain);
        const config: ChainParams = deepExtend({}, baseConfig, userConfig);
        return new Chain(config);
    }

    /**
     *  Returns the ChainParams object represents given chain.
     * @param chain
     */
    static getBaseParams(chain: string | number): ChainParams {
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

        return baseConfig;
    }

    /**
     *
     */
    describe() {
        return JSON.parse(JSON.stringify(this));
    }

    /**
     *
     */
    createJsonRpcConnection(): Connection {
        return new Connection(this.chainId, new JsonRpcProvider(this.urls?.api?.node?.http[0]));
    }

    /**
     * Returns the Genesis parameters of current chain
     * @returns Genesis dictionary
     */
    get genesis(): GenesisBlock {
        return this.chainParams.genesis;
    }

    /**
     * Returns bootstrap nodes for the current chain
     * @returns {Dictionary} Dict with bootstrap nodes
     */
    get bootstrapNodes(): BootstrapNode[] {
        return this.chainParams.bootstrapNodes;
    }

    /**
     * Returns the name of current chain
     * @returns chain name (lower case)
     */
    get name(): string {
        return this.chainParams.name.toLowerCase();
    }

    /**
     * Returns the Id of current chain
     * @returns chain Id
     */
    get chainId(): ChainId {
        return this.chainParams.chainId;
    }

    /**
     * Returns the Id of current network
     * @returns network Id
     */
    get networkId(): number {
        return this.chainParams.networkId;
    }

    /**
     * Returns the Id of gasCoin for current network
     * @returns gasCoin Id
     */
    get gasCoin(): number {
        return this.chainParams.gasCoinId;
    }

    /**
     *
     */
    get urls(): { [k: string]: any } {
        return this.chainParams.urls;
    }
}
