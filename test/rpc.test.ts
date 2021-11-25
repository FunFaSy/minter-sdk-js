import * as minterSdk from '../src';

test('[RPC] Status', async () => {
    const chain = new minterSdk.Chain('mainnet');

    const rpcProvider = new minterSdk.providers.JsonRpcProvider({baseURL: chain.urls()?.api?.node?.http[0]});

    const status = await rpcProvider.status();
    expect(Number(status?.latest_block_height)).toBeGreaterThan(1);
});

test('[RPC] Latest Block', async () => {
    const chain = new minterSdk.Chain('mainnet');

    const rpcProvider = new minterSdk.providers.JsonRpcProvider({baseURL: chain.urls()?.api?.node?.http[0]});

    const block = await rpcProvider.block({
        height: await rpcProvider.status().then(res => res.latest_block_height),
    });

    expect(Number(block?.height)).toBeGreaterThan(1);
});

test('[RPC] Latest N blocks batch', async () => {
    const BLOCK_TAIL=5;

    const chain = new minterSdk.Chain('mainnet');

    const rpcProvider = new minterSdk.providers.JsonRpcProvider({baseURL: chain.urls()?.api?.node?.http[0]});

    const height = await rpcProvider.status().then(res => Number(res?.latest_block_height));

    const blocks = await rpcProvider.blocks({fromHeight: height - BLOCK_TAIL, toHeight: height});

    expect(Number(blocks?.blocks?.length)).toBeGreaterThanOrEqual(BLOCK_TAIL);
});

test('[RPC] Current Validators list', async () => {
    const chain = new minterSdk.Chain('mainnet');

    const rpcProvider = new minterSdk.providers.JsonRpcProvider({baseURL: chain.urls()?.api?.node?.http[0]});

    const validators = await rpcProvider.candidates().then(res => res?.candidates.filter(c => c.validator));

    expect(validators.length).toBeGreaterThanOrEqual(1);
});

test('[RPC] Candidate Info', async () => {
    const chain = new minterSdk.Chain('mainnet');

    const rpcProvider = new minterSdk.providers.JsonRpcProvider({baseURL: chain.urls()?.api?.node?.http[0]});

    const validator = await rpcProvider.candidates().then(res => res?.candidates.find(c => c.validator));

    const candidate = await rpcProvider.candidate({publicKey: validator.public_key});

    expect(candidate.public_key).toEqual(validator.public_key);
});

test('[RPC] Coin Info', async () => {
    const chain = new minterSdk.Chain('mainnet');

    const rpcProvider = new minterSdk.providers.JsonRpcProvider({baseURL: chain.urls()?.api?.node?.http[0]});

    const baseCoin = await rpcProvider.coinInfo({symbol: 'BIP'});

    const baseCoinById = await rpcProvider.coinInfoById({id: baseCoin.id});

    expect(baseCoin.symbol).toEqual(baseCoinById.symbol);
});
