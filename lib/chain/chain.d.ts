import { BootstrapNode, ChainId, ChainParams, GenesisBlock } from './types';
import { Connection } from '../connection';
/**
 * Chain class to access chain parameters
 */
export declare class Chain {
    private chainParams;
    /**
     * @constructor
     * @param chain String ('mainnet') or Number (1) or Dictionary with chain params
     */
    constructor(chain: string | number | ChainParams);
    /**
     * Returns the Genesis parameters of current chain
     * @returns Genesis dictionary
     */
    get genesis(): GenesisBlock;
    /**
     * Returns bootstrap nodes for the current chain
     * @returns {Dictionary} Dict with bootstrap nodes
     */
    get bootstrapNodes(): BootstrapNode[];
    /**
     * Returns the name of current chain
     * @returns chain name (lower case)
     */
    get name(): string;
    /**
     * Returns the Id of current chain
     * @returns chain Id
     */
    get chainId(): ChainId;
    /**
     * Returns the Id of current network
     * @returns network Id
     */
    get networkId(): number;
    /**
     * Returns the Id of gasCoin for current network
     * @returns gasCoin Id
     */
    get gasCoin(): number;
    /**
     *
     */
    get urls(): {
        [k: string]: any;
    };
    /**
     * Creates a Chain object for a custom chain, based on a standard one. It uses all the [[ChainParams]]
     * params from [[baseChain]] except the ones overridden in [[userConfig]].
     *
     * @param baseChain The name (`mainnet`) or id (`1`) of a standard chain used to base the custom
     * chain params on.
     * @param userConfig The custom parameters of the chain.
     */
    static forCustomChain(baseChain: string | number, userConfig: Partial<ChainParams>): Chain;
    /**
     *  Returns the ChainParams object represents given chain.
     * @param chain
     */
    static getBaseParams(chain: string | number): ChainParams;
    /**
     *
     */
    describe(): Record<string, any>;
    /**
     *
     */
    newJsonRpcConnection(): Connection;
}
