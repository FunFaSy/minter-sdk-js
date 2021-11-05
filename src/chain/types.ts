
export interface ChainInitialParams {
    name: string;// Mainnet
    chainId: number; // minter-mainnet-4
    networkId: number; // 4
    initialHeight: number;
    totalSlashed: number;
    blockMaxGas: number;
    blockTimeIotaMs: number;
    blockMaxBytes: number;
    comment: string;
    url: string;
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
