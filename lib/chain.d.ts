import { BootstrapNode, ChainParams, GenesisBlock } from './chain/types';
export * from './chain/types';
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
    describe(): any;
    /**
     * Returns the Genesis parameters of current chain
     * @returns Genesis dictionary
     */
    genesis(): GenesisBlock;
    /**
     * Returns bootstrap nodes for the current chain
     * @returns {Dictionary} Dict with bootstrap nodes
     */
    bootstrapNodes(): BootstrapNode[];
    /**
     * Returns the name of current chain
     * @returns chain name (lower case)
     */
    name(): string;
    /**
     * Returns the Id of current chain
     * @returns chain Id
     */
    chainId(): string;
    /**
     * Returns the Id of current network
     * @returns network Id
     */
    networkId(): number;
    /**
     * Returns the Id of gasCoin for current network
     * @returns gasCoin Id
     */
    gasCoin(): number;
    /**
     *
     */
    urls(): {
        [k: string]: any;
    };
}
