export interface ChainParams {
    name: string;
    chainId: string;
    networkId: number;
    initialHeight: number;
    totalSlashed: number;
    blockMaxGas: number;
    blockMaxBytes: number;
    gasCoinId: number;
    comment?: string;
    urls: {
        [key: string]: any;
    };
    genesis: GenesisBlock;
    bootstrapNodes: BootstrapNode[];
}
export interface GenesisBlock {
    hash: string;
    time: string;
    height: number;
    proposer?: string | null;
    blockReward?: string | null;
}
export interface BootstrapNode {
    id: string;
    ip: string;
    port: number | string;
    comment?: string;
}
export {};
