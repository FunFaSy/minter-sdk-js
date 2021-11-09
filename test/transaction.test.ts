import {TransactionParams} from '../src/transaction/transaction';
import * as minterApi from '../src';

const MNEMONIC = 'solar when satoshi champion about zebra crop solution leopard senior ability vocal';
// const ACC_PRIV_KEY = 'secp256k1:oYHhCijezmKqxduKENqWnkMYCuAeYZugduz3WusG1SjBVVQia'
// const ACC_PUB_KEY =  'secp256k1:WWjcQcvUjNi9AC5Y6zQGLYQy64mL1C3dnZgGZ3HfC28B9R22WFuuNpj8d14dUDJ1MsCSUkPbPrpExXh8vMbt5Vo9TtmC9';
// const ACC_ADDRESS =  'Mx0bd4dd45fc7072ce6f1a4b297706174ee2f86910';

const TX_SEND_RLP_ENCODED = 'f8710202018001a1e08094eb92ae39b84012968f63b2dd260a94d791fe79bd89056bc75e2d63100000000001b845f8431ba0384e5516462774e67c1efc016458af86e68f3780fadcb27c3587389dd36056e8a003b0f7547aee983bdcdcf76334d169dee271ffd96e9cb2284a68cfb1e54cedb0';
const TX_SEND_FROM = 'Mx0bd4dd45fc7072ce6f1a4b297706174ee2f86910';
const TX_SEND_HASH = 'Mt4aa02f046af4d129529da272b259ffa9002893cbd88c66293d30bcdee788002d';

//
test('[Tx] Transaction from encoded string', async () => {

    const tx = new minterApi.Transaction(`0x${TX_SEND_RLP_ENCODED}`);
    const address = tx.getSenderAddress();
    expect(address.toString()).toEqual(TX_SEND_FROM);
});

//
test('[Tx] Validate transaction signature', async () => {
    const txRawBuf = Buffer.from(TX_SEND_RLP_ENCODED, 'hex');
    const tx = new minterApi.Transaction(txRawBuf);
    expect(tx.isValidSignature()).toBeTruthy();
});

//
test('[Tx] Validate transaction hash', async () => {
    const sha256 = minterApi.utils.sha256;
    const txRawBuf = Buffer.from(TX_SEND_RLP_ENCODED, 'hex');
    const txMtHash = 'Mt' + sha256(txRawBuf).toString('hex').toLowerCase();
    expect(txMtHash).toEqual(TX_SEND_HASH);
});

//
test('[TxSingle] Send transaction type', async () => {

    const chain = new minterApi.Chain('testnet');
    const keyPair = minterApi.KeyPairSecp256k1.fromBip39Mnemonic(MNEMONIC);

    const txAction = new minterApi.tx_actions.SendAction({
        to   : 'Mxeb92ae39b84012968f63b2dd260a94d791fe79bd',
        coin : 0,
        value: minterApi.utils.convertBipToPip(100),
    });

    const txParams = {
        nonce        : 2,                   //
        chainId      : chain.networkId(),   //
        gasCoin      : 0,                   //
        gasPrice     : 1,                   //
        type         : txAction.type(),     //
        data         : txAction.serialize(),//
        payload      : '0x00',              //
        serviceData  : '0x00',              //
        signatureType: minterApi.SignatureType.Single,
    } as TransactionParams;

    const tx = new minterApi.Transaction(txParams);
    const signedTx = tx.sign(keyPair);

    expect(signedTx.signature.valid()).toBeTruthy();
    expect(signedTx.transaction.serialize().toString('hex')).toEqual(TX_SEND_RLP_ENCODED);

});

//
test('[TxSingle] Sell transaction type', async () => {
    const TX_RLP_ENCODED = 'f864030201800294d38089056bc75e2d63100000088609184e72a000808001b845f8431ba0c776f989f00a88b4eda645ef96536cbb45cf8b435c313cc8d15175b266da2e6da0025196590462d44f89d0363d6ce80fdd7faae241371f2062b96068efe51e5df8';
    const TX_HASH = 'Mt55dbfc5e345de08f8cb87d69280c02b2a24cc16cfe8f62ad8d50dd62337dc828';

    const convertBipToPip = minterApi.utils.convertBipToPip;
    const sha256 = minterApi.utils.sha256;

    const chain = new minterApi.Chain('testnet');
    const keyPair = minterApi.KeyPairSecp256k1.fromBip39Mnemonic(MNEMONIC);

    const txAction = new minterApi.tx_actions.SellAction({
        coinToSell       : 0,
        coinToBuy        : 8,
        valueToSell      : convertBipToPip(100),
        minimumValueToBuy: convertBipToPip(0.00001),
    });

    const txParams = {
        nonce        : 3,                   //
        chainId      : chain.networkId(),   //
        gasCoin      : 0,                   //
        gasPrice     : 1,                   //
        type         : txAction.type(),     //
        data         : txAction.serialize(),//
        signatureType: minterApi.SignatureType.Single,
    } as TransactionParams;

    const tx = new minterApi.Transaction(txParams);
    const signedTx = tx.sign(keyPair);

    const txRawBuf = Buffer.from(TX_RLP_ENCODED, 'hex');
    const txMtHash = 'Mt' + sha256(txRawBuf).toString('hex').toLowerCase();

    expect(signedTx.signature.valid()).toBeTruthy();
    expect(signedTx.transaction.serialize().toString('hex')).toEqual(TX_RLP_ENCODED);
    expect(txMtHash).toEqual(TX_HASH);
});

//
test('[TxSingle] Buy transaction type', async () => {
    const TX_RLP_ENCODED = 'f867040201800497d608893635c9adc5dea000008089056bc75e2d63100000808001b845f8431ba0d786b733cb72b0efa4ee997dfd1807e595969d4797c50aaf85b82690971b0c8aa0159f95a0fc63be40ecc9f9e4a21c05dd159d41b85f3cd1b59b84221dd1ec5b17';
    const TX_HASH = 'Mt06abf3f26b6092a3237564d50e6e6fdf94f01bbd07249d725bc6f6859f88e4fe';

    const convertBipToPip = minterApi.utils.convertBipToPip;
    const sha256 = minterApi.utils.sha256;

    const chain = new minterApi.Chain('testnet');
    const keyPair = minterApi.KeyPairSecp256k1.fromBip39Mnemonic(MNEMONIC);

    const txAction = new minterApi.tx_actions.BuyAction({
        coinToBuy         : 8,
        coinToSell        : 0,
        valueToBuy        : convertBipToPip(1000),
        maximumValueToSell: convertBipToPip(100),
    });

    const txParams = {
        nonce        : 4,                   //
        chainId      : chain.networkId(),   //
        gasCoin      : 0,                   //
        gasPrice     : 1,                   //
        type         : txAction.type(),     //
        data         : txAction.serialize(),//
        signatureType: minterApi.SignatureType.Single,
    } as TransactionParams;

    const tx = new minterApi.Transaction(txParams);
    const signedTx = tx.sign(keyPair);

    const txRawBuf = Buffer.from(TX_RLP_ENCODED, 'hex');
    const txMtHash = 'Mt' + sha256(txRawBuf).toString('hex').toLowerCase();

    expect(signedTx.signature.valid()).toBeTruthy();
    expect(signedTx.transaction.serialize().toString('hex')).toEqual(TX_RLP_ENCODED);
    expect(txMtHash).toEqual(TX_HASH);
});


//
test('[TxSingle] SellAll transaction type', async () => {
    const TX_RLP_ENCODED = 'f85c05020180038ccb8008888ac7230489e80000808001b845f8431ca08477a18f7fa755f9a2a0a38f813056818aab213f6d52d734b772b81649c3bb63a02d40cb3fa5d44dc15e06aedc8defb8b9ae3a93eee1b121936fabcb63bacc5149';
    const TX_HASH = 'Mt542d98735b6d920e944367b4594200f359c033f1780bcd8af9c089368f3f38ba';

    const convertBipToPip = minterApi.utils.convertBipToPip;
    const sha256 = minterApi.utils.sha256;

    const chain = new minterApi.Chain('testnet');
    const keyPair = minterApi.KeyPairSecp256k1.fromBip39Mnemonic(MNEMONIC);

    const txAction = new minterApi.tx_actions.SellAllAction({
        coinToBuy        : 8,
        coinToSell       : 0,
        minimumValueToBuy: convertBipToPip(10),
    });

    const txParams = {
        nonce        : 5,                   //
        chainId      : chain.networkId(),   //
        gasCoin      : 0,                   //
        gasPrice     : 1,                   //
        type         : txAction.type(),     //
        data         : txAction.serialize(),//
        signatureType: minterApi.SignatureType.Single,
    } as TransactionParams;

    const tx = new minterApi.Transaction(txParams);
    const signedTx = tx.sign(keyPair);

    const txRawBuf = Buffer.from(TX_RLP_ENCODED, 'hex');
    const txMtHash = 'Mt' + sha256(txRawBuf).toString('hex').toLowerCase();

    expect(signedTx.signature.valid()).toBeTruthy();
    expect(signedTx.transaction.serialize().toString('hex')).toEqual(TX_RLP_ENCODED);
    expect(txMtHash).toEqual(TX_HASH);
});

//
test('[TxSingle] AddLiquidity type transaction', async () => {
    const TX_RLP_ENCODED = 'f865070201801595d40880888ac7230489e80000888ac7230489e80000808001b845f8431ca0bdb3df820c35383470c86b3c07e1bf35ad1c91addc916fa42baa0f8d43486650a036d0f627093476edefed192c4edfdef6ed5634f363bb07e9f0e8e6f64780a8d8';
    const TX_HASH = 'Mt579aa8c32559c09c071f277886f0a6b0f0ef3316bb8d95ef5048a91587da7bf2';

    const convertBipToPip = minterApi.utils.convertBipToPip;
    const sha256 = minterApi.utils.sha256;

    const chain = new minterApi.Chain('testnet');
    const keyPair = minterApi.KeyPairSecp256k1.fromBip39Mnemonic(MNEMONIC);

    const txAction = new minterApi.tx_actions.AddLiquidityAction({
        coin0         : 8,
        coin1         : 0,
        volume0       : convertBipToPip(10),
        maximumVolume1: convertBipToPip(10),
    });

    const txParams = {
        nonce        : 7,                   //
        chainId      : chain.networkId(),   //
        gasCoin      : 0,                   //
        gasPrice     : 1,                   //
        type         : txAction.type(),     //
        data         : txAction.serialize(),//
        signatureType: minterApi.SignatureType.Single,
    } as TransactionParams;

    const tx = new minterApi.Transaction(txParams);
    const signedTx = tx.sign(keyPair);

    const txRawBuf = Buffer.from(TX_RLP_ENCODED, 'hex');
    const txMtHash = 'Mt' + sha256(txRawBuf).toString('hex').toLowerCase();

    expect(signedTx.signature.valid()).toBeTruthy();
    expect(signedTx.transaction.serialize().toString('hex')).toEqual(TX_RLP_ENCODED);
    expect(txMtHash).toEqual(TX_HASH);
});

//
test('[TxSingle] BuySwap transaction type', async () => {
    const TX_RLP_ENCODED = 'f869080201801899d8c480820734880de0b6b3a7640000890ad78ebc5ac6200000808001b845f8431ca098c0e06a1a3c0fd309b5887f1f09aff3d3ba41cec52922cde4a316916c7cc741a008786ae1c1072c9c77f34a3b4cbe4aa38b30b1ed61d55e58a1864608ba8691b1';
    const TX_HASH = 'Mtb4c3b7c9c42eb90917e98e7b73a4e6c8602d2ed1cd5894d2a8c3cf5e553ce60b';

    const convertBipToPip = minterApi.utils.convertBipToPip;
    const sha256 = minterApi.utils.sha256;

    const chain = new minterApi.Chain('testnet');
    const keyPair = minterApi.KeyPairSecp256k1.fromBip39Mnemonic(MNEMONIC);

    const txAction = new minterApi.tx_actions.BuySwapAction({
        coins             : [0, 1844],
        valueToBuy        : convertBipToPip(1),
        maximumValueToSell: convertBipToPip(200),
    });

    const txParams = {
        nonce        : 8,                   //
        chainId      : chain.networkId(),   //
        gasCoin      : 0,                   //
        gasPrice     : 1,                   //
        type         : txAction.type(),     //
        data         : txAction.serialize(),//
        signatureType: minterApi.SignatureType.Single,
    } as TransactionParams;

    const tx = new minterApi.Transaction(txParams);
    const signedTx = tx.sign(keyPair);

    const txRawBuf = Buffer.from(TX_RLP_ENCODED, 'hex');
    const txMtHash = 'Mt' + sha256(txRawBuf).toString('hex').toLowerCase();

    expect(signedTx.signature.valid()).toBeTruthy();
    expect(signedTx.transaction.serialize().toString('hex')).toEqual(TX_RLP_ENCODED);
    expect(txMtHash).toEqual(TX_HASH);
});

// //
// test('[TxSingle] MintTokenAction type transaction', async () => {
//     const TX_RLP_ENCODED = '';
//     const TX_HASH = '';
//
//     const convertBipToPip = minterApi.utils.convertBipToPip;
//     const sha256 = minterApi.utils.sha256;
//
//     const chain = new minterApi.Chain('testnet');
//     const keyPair = minterApi.KeyPairSecp256k1.fromBip39Mnemonic(MNEMONIC);
//
//     const txAction = new minterApi.tx_actions.MintTokenAction({
//         coin : 8,
//         value: convertBipToPip(10),
//     });
//
//     const txParams = {
//         nonce        : 7,                   //
//         chainId      : chain.networkId(),   //
//         gasCoin      : 0,                   //
//         gasPrice     : 1,                   //
//         type         : txAction.type(),     //
//         data         : txAction.serialize(),//
//         signatureType: minterApi.SignatureType.Single,
//     } as TransactionParams;
//
//     const tx = new minterApi.Transaction(txParams);
//     const signedTx = tx.sign(keyPair);
//
//     const txRawBuf = Buffer.from(TX_RLP_ENCODED, 'hex');
//     const txMtHash = 'Mt' + sha256(txRawBuf).toString('hex').toLowerCase();
//
//     expect(signedTx.signature.valid()).toBeTruthy();
//     expect(signedTx.transaction.serialize().toString('hex')).toEqual(TX_RLP_ENCODED);
//     expect(txMtHash).toEqual(TX_HASH);
// });
