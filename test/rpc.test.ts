import * as minterSdk from '../src';

test('[RPC] Status', async () => {
    const chain = new minterSdk.Chain('testnet');

    const rpcProvider = new minterSdk.providers.JsonRpcProvider({baseURL: chain.urls()?.api?.node?.http[0]});

    const status = await rpcProvider.status();
    expect(Number(status?.latest_block_height)).toBeGreaterThan(1);
});

test('[RPC] Candidates-validators', async () => {
    const chain = new minterSdk.Chain('testnet');

    const rpcProvider = new minterSdk.providers.JsonRpcProvider({baseURL: chain.urls()?.api?.node?.http[0]});

    const validators = await rpcProvider.candidates().then(res => res?.candidates.filter(c => c.validator));

    expect(validators.length).toBeGreaterThanOrEqual(1);
});

test('[RPC] Candidate', async () => {
    const chain = new minterSdk.Chain('testnet');

    const rpcProvider = new minterSdk.providers.JsonRpcProvider({baseURL: chain.urls()?.api?.node?.http[0]});

    const validator = await rpcProvider.candidates().then(res => res?.candidates.find(c => c.validator));

    const candidate = await rpcProvider.candidate({publicKey: validator.public_key});

    expect(candidate.public_key).toEqual(validator.public_key);
});

test('[RPC] Coin Info', async () => {
    const chain = new minterSdk.Chain('testnet');

    const rpcProvider = new minterSdk.providers.JsonRpcProvider({baseURL: chain.urls()?.api?.node?.http[0]});

    const baseCoin = await rpcProvider.coinInfo({symbol: 'BIP'});
    const baseCoinById = await rpcProvider.coinInfoById({id: baseCoin.id});

    expect(baseCoin.symbol).toEqual(baseCoinById.symbol);
});
