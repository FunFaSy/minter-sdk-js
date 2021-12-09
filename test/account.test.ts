// const ACC_PRIV_KEY = 'secp256k1:oYHhCijezmKqxduKENqWnkMYCuAeYZugduz3WusG1SjBVVQia'
// const ACC_PUB_KEY =  'secp256k1:WWjcQcvUjNi9AC5Y6zQGLYQy64mL1C3dnZgGZ3HfC28B9R22WFuuNpj8d14dUDJ1MsCSUkPbPrpExXh8vMbt5Vo9TtmC9';
// const ACC_ADDRESS =  'Mx0bd4dd45fc7072ce6f1a4b297706174ee2f86910';

// const TX_RLP_ENCODED = 'f8710202018001a1e08094eb92ae39b84012968f63b2dd260a94d791fe79bd89056bc75e2d63100000000001b845f8431ba0384e5516462774e67c1efc016458af86e68f3780fadcb27c3587389dd36056e8a003b0f7547aee983bdcdcf76334d169dee271ffd96e9cb2284a68cfb1e54cedb0';
// const TX_SENDER_ADDRESS = 'Mx0bd4dd45fc7072ce6f1a4b297706174ee2f86910';
// const TX_HASH = 'Mt4aa02f046af4d129529da272b259ffa9002893cbd88c66293d30bcdee788002d';
import * as minterSdk from '../src';
import {TransactionParams} from '../src/transaction/transaction';


const MNEMONIC = 'solar when satoshi champion about zebra crop solution leopard senior ability vocal';
const ADDRESS = 'Mx0bd4dd45fc7072ce6f1a4b297706174ee2f86910';


test('[Account] From BIP39 mnemonic', async () => {

    const wal = await minterSdk.Wallet.fromMnemonic(MNEMONIC);
    const account = await wal.getAccount();

    expect(account.address.toString()).toEqual(ADDRESS);
});


test('[Account] Derive from HDWallet BIP44', async () => {
    const ADDRESS1 = 'Mx28c5ea5a7bf95cbce33647ee86132e57bd47982f';

    const wal = await minterSdk.Wallet.fromMnemonic(MNEMONIC);
    const account = await wal.getAccount(0);
    const account1 = await wal.getAccount(1);

    expect(account.address.toString()).toEqual(ADDRESS);
    expect(account1.address.toString()).toEqual(ADDRESS1);
});

test('[Account] Connect to test network', async () => {
    const chain = new minterSdk.Chain(minterSdk.ChainId.TESTNET);
    const wal = await minterSdk.Wallet.fromMnemonic(MNEMONIC)// By default wallet connected to 'Mainnet'
        .then(wal => wal.setConnection(chain.newJsonRpcConnection()));  // connect to Testnet

    const account = await wal.getAccount(0);
    const nonce = Number(await account.nonce());

    expect(nonce).toBeGreaterThanOrEqual(1);
});


test('[Account] Sign transaction', async () => {
    const TX_RLP_ENCODED = 'f8710202018001a1e08094eb92ae39b84012968f63b2dd260a94d791fe79bd89056bc75e2d63100000000001b845f8431ba0384e5516462774e67c1efc016458af86e68f3780fadcb27c3587389dd36056e8a003b0f7547aee983bdcdcf76334d169dee271ffd96e9cb2284a68cfb1e54cedb0';

    const chain = new minterSdk.Chain('testnet');
    const wal = await minterSdk.Wallet.fromMnemonic(MNEMONIC);
    const account = await wal.getAccount();

    const txAction = new minterSdk.tx_actions.SendAction({
        to   : 'Mxeb92ae39b84012968f63b2dd260a94d791fe79bd',
        coin : 0,
        value: minterSdk.utils.convertBipToPip(100),
    });

    const txParams = {
        nonce        : 2,                   //
        chainId      : chain.networkId,   //
        gasCoin      : 0,                   //
        gasPrice     : 1,                   //
        type         : txAction.type(),     //
        data         : txAction.serialize(),//
        payload      : '0x00',              //
        serviceData  : '0x00',              //
        signatureType: minterSdk.SignatureType.Single,
    } as TransactionParams;


    const signedTx = await account.signTx(new minterSdk.Transaction(txParams));

    expect(signedTx.signature.valid()).toBeTruthy();
    expect(signedTx.transaction.serialize().toString('hex')).toEqual(TX_RLP_ENCODED);
});


test('[Account] Set store', async () => {
    const imStore = new minterSdk.keyStores.InMemoryKeyStore(); // default store. just for test example
    const wal = await minterSdk.Wallet.fromMnemonic(MNEMONIC).then(wal=>wal.setKeyStore(imStore));
    const account = await wal.getAccount();

    // @ts-ignore
    const storeType = account._keyStore.toString(); // don't do like that. Just for test purpose

    expect(storeType).toEqual('InMemoryKeyStore');
});
