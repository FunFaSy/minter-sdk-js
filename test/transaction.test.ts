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
test('[TxSingle] MultiSend transaction type', async () => {
    const TX_RLP_ENCODED = 'f8970b0201800db846f844f842e08094eb92ae39b84012968f63b2dd260a94d791fe79bd89056bc75e2d63100000e080940bd4dd45fc7072ce6f1a4b297706174ee2f8691089056bc75e2d63100000808001b845f8431ca0517aa888715c81d21d508fffee4218100893f9ab155ff3929bd70babafea66b6a0343838747fbf52ca57a150025370a1e5d1e2aa8965edf5ef7a88cd12566ff90f';
    const TX_HASH = 'Mt1cea90c78f69a9a62e6fe1d349470e4d598229aabf71dd9b76ae174c9fb73abe';

    const utils = minterApi.utils;
    const SendAction = minterApi.tx_actions.SendAction;

    const chain = new minterApi.Chain('testnet');
    const keyPair = minterApi.KeyPairSecp256k1.fromBip39Mnemonic(MNEMONIC);

    const txAction = new minterApi.tx_actions.MultiSendAction({
        list: [
            new SendAction({
                to   : 'Mxeb92ae39b84012968f63b2dd260a94d791fe79bd',
                coin : 0,
                value: utils.convertBipToPip(100),
            }),
            new SendAction({
                to   : 'Mx0bd4dd45fc7072ce6f1a4b297706174ee2f86910',
                coin : 0,
                value: utils.convertBipToPip(100),
            }),
        ],
    });

    const txParams = {
        nonce        : 11,                  //
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
    const txMtHash = 'Mt' + utils.sha256(txRawBuf).toString('hex').toLowerCase();

    expect(signedTx.signature.valid()).toBeTruthy();
    expect(signedTx.transaction.serialize().toString('hex')).toEqual(TX_RLP_ENCODED);
    expect(txMtHash).toEqual(TX_HASH);
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

//
test('[TxSingle] SellSwap transaction type', async () => {
    const TX_RLP_ENCODED = 'f867090201801797d6c2088089056bc75e2d6310000088016345785d8a0000808001b845f8431ba00f4601ed63aacc1c1624155c6e68d2ecaa04b1b7475cab8a9bb2dab760ca76d5a03c3f5169f28a357b23179e072fca233b0a4ad1fca6687dd415f08241cfdaeca7';
    const TX_HASH = 'Mtd60fb2ff229b6d047b45388fc1b9eb53c86d402b605448624de82125d498f43b';

    const convertBipToPip = minterApi.utils.convertBipToPip;
    const sha256 = minterApi.utils.sha256;

    const chain = new minterApi.Chain('testnet');
    const keyPair = minterApi.KeyPairSecp256k1.fromBip39Mnemonic(MNEMONIC);

    const txAction = new minterApi.tx_actions.SellSwapAction({
        coins            : [8, 0],
        valueToSell      : convertBipToPip(100),
        minimumValueToBuy: convertBipToPip(0.1),
    });

    const txParams = {
        nonce        : 9,                   //
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
test('[TxSingle] SellAllSwap transaction type', async () => {
    const TX_RLP_ENCODED = 'f85d0a020180198dccc208808806f05b59d3b20000808001b845f8431ca06477a6168fe6903caa0b1752da42fb42a3c1bfcc348965ddac4d08b63a18c73da04f40aa57a2787370303eb571605e0f6733a6ae65191bc6a8183750735ec82e92';
    const TX_HASH = 'Mt09845a2675e083dfb562c148b8d439068f2055f23560a2407a379e1d4dcce000';

    const convertBipToPip = minterApi.utils.convertBipToPip;
    const sha256 = minterApi.utils.sha256;

    const chain = new minterApi.Chain('testnet');
    const keyPair = minterApi.KeyPairSecp256k1.fromBip39Mnemonic(MNEMONIC);

    const txAction = new minterApi.tx_actions.SellAllSwapAction({
        coins            : [8, 0],
        minimumValueToBuy: convertBipToPip(0.5),
    });

    const txParams = {
        nonce        : 10,                  //
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
test('[TxSingle] CreateSwapPoolAction transaction type', async () => {
    const TX_RLP_ENCODED = 'f8670d0201802297d68207ab8088016345785d8a0000880de0b6b3a7640000808001b845f8431ba0884a1cadb8f9f23d3694916a1e402cfcc75e51fafb85219ba7acee5b170ef472a03bf237db963c603631a532d5e3837ee7e7856442bc181a06a26669ba081d6d16';
    const TX_HASH = 'Mta04bd7b8e92d544e24e83c4a032ef3d98693ae05f4dd754c872ac2c2a1a6c546';

    const utils = minterApi.utils;
    const convertBipToPip = utils.convertBipToPip;
    const sha256 = utils.sha256;

    const chain = new minterApi.Chain('testnet');
    const keyPair = minterApi.KeyPairSecp256k1.fromBip39Mnemonic(MNEMONIC);

    const txAction = new minterApi.tx_actions.CreateSwapPoolAction({
        coin0  : 1963, //
        coin1  : 0, //
        volume0: convertBipToPip(0.1),            //
        volume1: convertBipToPip(1),            //
    });

    const txParams = {
        nonce        : 13,                  //
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
test('[TxSingle] RemoveLiquidity transaction type', async () => {
    const TX_RLP_ENCODED = 'f86d0c020180169ddc0880880155856da363916e8802a8583c427cc0008701b64916513800808001b845f8431ba07d3a884c5c7dfb39dbdfbc9d15f2207846368f26946c3e5142220046b10c36f1a05f0717d84b1519ef12ffe20b1df7673001bc76d313e0829969fb39b83e6b7319';
    const TX_HASH = 'Mt67ddc2c32f9da4fe089d9a4b815ae990ff32478b3b62422e1fce7251124fd8e3';

    const utils = minterApi.utils;
    const convertBipToPip = utils.convertBipToPip;
    const sha256 = utils.sha256;

    const chain = new minterApi.Chain('testnet');
    const keyPair = minterApi.KeyPairSecp256k1.fromBip39Mnemonic(MNEMONIC);

    const txAction = new minterApi.tx_actions.RemoveLiquidityAction({
        coin0         : 8, //
        coin1         : 0, //
        liquidity     : convertBipToPip(0.096129672997474677), // LP-tokens amount to remove
        minimumVolume0: convertBipToPip(0.1915),               //
        minimumVolume1: convertBipToPip(0.0004819),            //
    });

    const txParams = {
        nonce        : 12,                  //
        chainId      : chain.networkId(),   //
        gasCoin      : 0,                   //
        gasPrice     : 1,                   //
        type         : txAction.type(),     //
        data         : txAction.serialize(),//
        signatureType: minterApi.SignatureType.Single,
    };

    const tx = new minterApi.Transaction(txParams);
    const signedTx = tx.sign(keyPair);

    const txRawBuf = Buffer.from(TX_RLP_ENCODED, 'hex');
    const txMtHash = 'Mt' + sha256(txRawBuf).toString('hex').toLowerCase();

    expect(signedTx.signature.valid()).toBeTruthy();
    expect(signedTx.transaction.serialize().toString('hex')).toEqual(TX_RLP_ENCODED);
    expect(txMtHash).toEqual(TX_HASH);
});

//
test('[TxSingle] CreateCoin transaction type', async () => {
    const TX_RLP_ENCODED = 'f8960e02018005b845f843944e657720737570657220707570657220636f696e8a535550455250555045528ad3c21bcecceda10000008a021e19e0c9bab2400000648b084595161401484a000000808001b845f8431ba06bb38dc30b794d8349b6fc4fc49d17c8a8082ae3cee7263fa3171e284d9628f9a06b4e9e2f5e6b86b3e1596d30a6ebe3fcbaba64cf503aad2bef8d7328c0596b2b';
    const TX_HASH = 'Mt6b8bdfca91d9ab88021696fbbdf51b9300ee62dfb8cf823125fba58da6c17dc2';

    const utils = minterApi.utils;
    const convertBipToPip = utils.convertBipToPip;
    const sha256 = utils.sha256;

    const chain = new minterApi.Chain('testnet');
    const keyPair = minterApi.KeyPairSecp256k1.fromBip39Mnemonic(MNEMONIC);

    const txAction = new minterApi.tx_actions.CreateCoinAction({
        name                : 'New super puper coin',        //
        symbol              : 'SUPERPUPER',                  // Max 10 chars
        initialAmount       : convertBipToPip(1000000), //
        initialReserve      : convertBipToPip(10000),   //
        constantReserveRatio: 100,                           // 10 - 100 %
        maxSupply           : convertBipToPip(10000000), //
    });

    const txParams = {
        nonce        : 14,                  //
        chainId      : chain.networkId(),   //
        gasCoin      : 0,                   //
        gasPrice     : 1,                   //
        type         : txAction.type(),     //
        data         : txAction.serialize(),//
        signatureType: minterApi.SignatureType.Single,
    };

    const tx = new minterApi.Transaction(txParams);
    const signedTx = tx.sign(keyPair);

    const txRawBuf = Buffer.from(TX_RLP_ENCODED, 'hex');
    const txMtHash = 'Mt' + sha256(txRawBuf).toString('hex').toLowerCase();

    expect(signedTx.signature.valid()).toBeTruthy();
    expect(signedTx.transaction.serialize().toString('hex')).toEqual(TX_RLP_ENCODED);
    expect(txMtHash).toEqual(TX_HASH);
});

//
test('[TxSingle] ReCreateCoin transaction type', async () => {
    const TX_RLP_ENCODED = 'f8950f02018010b844f842944e657720737570657220707570657220636f696e8a535550455250555045528a021e19e0c9bab24000008a021e19e0c9bab24000000a8ad3c21bcecceda1000000808001b845f8431ca0dd8c7e72ed40ca573c0704f27b7f3fa8b904b5063134c6052ac3a1564e5dfd97a05448534ec00b642fa664796afd68f78538272b9d21429ee916396e898cb2fbff';
    const TX_HASH = 'Mt49b1dc621fbdabe11d6e92c18ed4ed0bc1e343253aa0fb98c341a251481c281b';

    const utils = minterApi.utils;
    const convertBipToPip = utils.convertBipToPip;
    const sha256 = utils.sha256;

    const chain = new minterApi.Chain('testnet');
    const keyPair = minterApi.KeyPairSecp256k1.fromBip39Mnemonic(MNEMONIC);

    const txAction = new minterApi.tx_actions.ReCreateCoinAction({
        name                : 'New super puper coin',            //
        symbol              : 'SUPERPUPER',                      // Max 10 chars
        initialAmount       : convertBipToPip(10_000),      //
        initialReserve      : convertBipToPip(10_000),      //
        constantReserveRatio: 10,                                // 10 - 100 %
        maxSupply           : convertBipToPip(1_000_000),    //
    });

    const txParams = {
        nonce        : 15,                  //
        chainId      : chain.networkId(),   //
        gasCoin      : 0,                   //
        gasPrice     : 1,                   //
        type         : txAction.type(),     //
        data         : txAction.serialize(),//
        signatureType: minterApi.SignatureType.Single,
    };

    const tx = new minterApi.Transaction(txParams);
    const signedTx = tx.sign(keyPair);

    const txRawBuf = Buffer.from(TX_RLP_ENCODED, 'hex');
    const txMtHash = 'Mt' + sha256(txRawBuf).toString('hex').toLowerCase();

    expect(signedTx.signature.valid()).toBeTruthy();
    expect(signedTx.transaction.serialize().toString('hex')).toEqual(TX_RLP_ENCODED);
    expect(txMtHash).toEqual(TX_HASH);
});

//
test('[TxSingle] CreateToken transaction type', async () => {
    const TX_RLP_ENCODED = 'f88c100201801eb83bf839954e657720737570657220707570657220544f4b454e8a5355504552544f4b454e8a152d02c7e14af68000008ad3c21bcecceda10000000180808001b845f8431ba0386990bdddbed058d2237e7541865f3a25dc7206c6839105405ed2cc25745d2ea06ea884aa7b676392faf3ac853c60d67b1210285f889d4bbf067d626276c738e8';
    const TX_HASH = 'Mt4369b8e21f589748dcda56c315857ebd5aae0e6162175642673c200c633fdffd';

    const utils = minterApi.utils;
    const convertBipToPip = utils.convertBipToPip;
    const sha256 = utils.sha256;

    const chain = new minterApi.Chain('testnet');
    const keyPair = minterApi.KeyPairSecp256k1.fromBip39Mnemonic(MNEMONIC);

    const txAction = new minterApi.tx_actions.CreateTokenAction({
        name         : 'New super puper TOKEN',          //
        symbol       : 'SUPERTOKEN',                     // Max 10 chars
        initialAmount: convertBipToPip(100_000),    //
        maxSupply    : convertBipToPip(1_000_000),  // Default: 10^15 PIP
        mintable     : true,
        burnable     : false,
    });

    const txParams = {
        nonce        : 16,                  //
        chainId      : chain.networkId(),   //
        gasCoin      : 0,                   //
        gasPrice     : 1,                   //
        type         : txAction.type(),     //
        data         : txAction.serialize(),//
        signatureType: minterApi.SignatureType.Single,
    };

    const tx = new minterApi.Transaction(txParams);
    const signedTx = tx.sign(keyPair);

    const txRawBuf = Buffer.from(TX_RLP_ENCODED, 'hex');
    const txMtHash = 'Mt' + sha256(txRawBuf).toString('hex').toLowerCase();

    expect(signedTx.signature.valid()).toBeTruthy();
    expect(signedTx.transaction.serialize().toString('hex')).toEqual(TX_RLP_ENCODED);
    expect(txMtHash).toEqual(TX_HASH);
});

//
test('[TxSingle] ReCreateToken transaction type', async () => {
    const TX_RLP_ENCODED = 'f88d110201801fb83cf83a954e657720737570657220707570657220544f4b454e8a5355504552544f4b454e8a2a5a058fc295ed0000008b01a784379d99db420000000180808001b845f8431ba07d77377fd182698f0ba81213b7f0a98b4c3dfbd4a6f6afdab65988438a9e598da0798d3244892091a9cb0053c1bb3b6c3b9a738e2ca7209dd35392334621f5cf1b';
    const TX_HASH = 'Mt45c936459010d707e8dcc61a68a8d05f7435413c797e116656868a3e75015c91';

    const utils = minterApi.utils;
    const convertBipToPip = utils.convertBipToPip;
    const sha256 = utils.sha256;

    const chain = new minterApi.Chain('testnet');
    const keyPair = minterApi.KeyPairSecp256k1.fromBip39Mnemonic(MNEMONIC);

    const txAction = new minterApi.tx_actions.ReCreateTokenAction({
        name         : 'New super puper TOKEN',          //
        symbol       : 'SUPERTOKEN',                     // Max 10 chars
        initialAmount: convertBipToPip(200_000),    //
        maxSupply    : convertBipToPip(2_000_000),  // Default: 10^15 PIP
        mintable     : true,
        burnable     : false,
    });

    const txParams = {
        nonce        : 17,                  //
        chainId      : chain.networkId(),   //
        gasCoin      : 0,                   //
        gasPrice     : 1,                   //
        type         : txAction.type(),     //
        data         : txAction.serialize(),//
        signatureType: minterApi.SignatureType.Single,
    };

    const tx = new minterApi.Transaction(txParams);
    const signedTx = tx.sign(keyPair);

    const txRawBuf = Buffer.from(TX_RLP_ENCODED, 'hex');
    const txMtHash = 'Mt' + sha256(txRawBuf).toString('hex').toLowerCase();

    expect(signedTx.signature.valid()).toBeTruthy();
    expect(signedTx.transaction.serialize().toString('hex')).toEqual(TX_RLP_ENCODED);
    expect(txMtHash).toEqual(TX_HASH);
});

//
test('[TxSingle] EditTickerOwner transaction type', async () => {
    const TX_RLP_ENCODED = 'f8711202018011a1e08a5355504552544f4b454e94eb92ae39b84012968f63b2dd260a94d791fe79bd808001b845f8431ba0fce9525cccd9eb9de9d94172036b3c0d29c86b9f10ed1789e1b0394c1d0e82a1a0754361f9ae5784306945cb3ce12d0c135e419edc121a8ad7fbd6c89d4e1ca119';
    const TX_HASH = 'Mt376dfa10e916c7a04defb8db06a00321a7aae25f5ca4d6c3e60dcc2a3ef87e6f';

    const utils = minterApi.utils;
    const sha256 = utils.sha256;

    const chain = new minterApi.Chain('testnet');
    const keyPair = minterApi.KeyPairSecp256k1.fromBip39Mnemonic(MNEMONIC);

    const txAction = new minterApi.tx_actions.EditTickerOwnerAction({
        newOwner: 'Mxeb92ae39b84012968f63b2dd260a94d791fe79bd', //
        symbol  : 'SUPERTOKEN',                                 // Max 10 chars
    });

    const txParams = {
        nonce        : 18,                  //
        chainId      : chain.networkId(),   //
        gasCoin      : 0,                   //
        gasPrice     : 1,                   //
        type         : txAction.type(),     //
        data         : txAction.serialize(),//
        signatureType: minterApi.SignatureType.Single,
    };

    const tx = new minterApi.Transaction(txParams);
    const signedTx = tx.sign(keyPair);

    const txRawBuf = Buffer.from(TX_RLP_ENCODED, 'hex');
    const txMtHash = 'Mt' + sha256(txRawBuf).toString('hex').toLowerCase();

    expect(signedTx.signature.valid()).toBeTruthy();
    expect(signedTx.transaction.serialize().toString('hex')).toEqual(TX_RLP_ENCODED);
    expect(txMtHash).toEqual(TX_HASH);
});

//
test('[TxSingle] MintToken transaction type', async () => {
    const TX_RLP_ENCODED = 'f85f130201801c8fce8207da8a021e19e0c9bab2400000808001b845f8431ca06d6a98205a9be7b869cca30b9e2c937895c03a22d82016dd0c60241fbe0cba26a0550976087c151621b2d91af612f44c9d9534bc6aa45dd0d204d2027a0888b689';
    const TX_HASH = 'Mt863e0b89375cfcc8622cc338ed972b6f623bc29aa496906a69ed7de3a6af4b6a';

    const utils = minterApi.utils;
    const sha256 = utils.sha256;
    const convertBipToPip = utils.convertBipToPip;

    const chain = new minterApi.Chain('testnet');
    const keyPair = minterApi.KeyPairSecp256k1.fromBip39Mnemonic(MNEMONIC);

    const txAction = new minterApi.tx_actions.MintTokenAction({
        coin : 2010,                                 // Coin Id
        value: convertBipToPip(10_000),
    });

    const txParams = {
        nonce        : 19,                  //
        chainId      : chain.networkId(),   //
        gasCoin      : 0,                   //
        gasPrice     : 1,                   //
        type         : txAction.type(),     //
        data         : txAction.serialize(),//
        signatureType: minterApi.SignatureType.Single,
    };

    const tx = new minterApi.Transaction(txParams);
    const signedTx = tx.sign(keyPair);

    const txRawBuf = Buffer.from(TX_RLP_ENCODED, 'hex');
    const txMtHash = 'Mt' + sha256(txRawBuf).toString('hex').toLowerCase();

    expect(signedTx.signature.valid()).toBeTruthy();
    expect(signedTx.transaction.serialize().toString('hex')).toEqual(TX_RLP_ENCODED);
    expect(txMtHash).toEqual(TX_HASH);
});

//
test('[TxSingle] BurnToken transaction type', async () => {
    const TX_RLP_ENCODED = 'f85f150201801d8fce8207db8a021e19e0c9bab2400000808001b845f8431ca01cc0d4e440b70d745009cdd355a53257c88319355360fc65582ae20901d903afa0455560a5deafdac094fef03eccf11f4df3b73145019903aa70dae7123bdca32d';
    const TX_HASH = 'Mt532e755d326f5b5d0f4e5367d49f07310704792228b4878c51916c7470009b8d';

    const utils = minterApi.utils;
    const sha256 = utils.sha256;
    const convertBipToPip = utils.convertBipToPip;

    const chain = new minterApi.Chain('testnet');
    const keyPair = minterApi.KeyPairSecp256k1.fromBip39Mnemonic(MNEMONIC);

    const txAction = new minterApi.tx_actions.BurnTokenAction({
        coin : 2011,                                 // Coin Id
        value: convertBipToPip(10_000),
    });

    const txParams = {
        nonce        : 21,                  //
        chainId      : chain.networkId(),   //
        gasCoin      : 0,                   //
        gasPrice     : 1,                   //
        type         : txAction.type(),     //
        data         : txAction.serialize(),//
        signatureType: minterApi.SignatureType.Single,
    };

    const tx = new minterApi.Transaction(txParams);
    const signedTx = tx.sign(keyPair);

    const txRawBuf = Buffer.from(TX_RLP_ENCODED, 'hex');
    const txMtHash = 'Mt' + sha256(txRawBuf).toString('hex').toLowerCase();

    expect(signedTx.signature.valid()).toBeTruthy();
    expect(signedTx.transaction.serialize().toString('hex')).toEqual(TX_RLP_ENCODED);
    expect(txMtHash).toEqual(TX_HASH);
});

//
test('[TxSingle] DeclareCandidacy transaction type', async () => {
    const TX_RLP_ENCODED = 'f8961602018006b845f843940bd4dd45fc7072ce6f1a4b297706174ee2f86910a06787a7adfed250d13cd089db516e274d71f105f4e6a0639e0f9521985ea6c2010f808a152d02c7e14af6800000808001b845f8431ba01817f26876111249856a94b9bee59840f959a871dd3c4b623eb425d785e08ff2a07272ad227ecf062763b28b557b82f1237f1a1d5f799cc0c2280cb58c9bd26a2d';
    const TX_HASH = 'Mt2047a7d0121f9d3d95b79fdf0d516cde06b5f9daaa81860e7585b76029593b2f';

    const utils = minterApi.utils;
    const sha256 = utils.sha256;
    const convertBipToPip = utils.convertBipToPip;

    const chain = new minterApi.Chain('testnet');
    const keyPair = minterApi.KeyPairSecp256k1.fromBip39Mnemonic(MNEMONIC);

    const txAction = new minterApi.tx_actions.DeclareCandidacyAction({
        address   : 'Mx0bd4dd45fc7072ce6f1a4b297706174ee2f86910', // Validator owner  address Mx.............
        publicKey : 'Mp6787a7adfed250d13cd089db516e274d71f105f4e6a0639e0f9521985ea6c201', // Validator node pub key Mp.............
        commission: 15, // 0-100 %
        coin      : 0, // Coin ID .Initial self bonded Stake coin
        stake     : convertBipToPip(100_000), // PIP units Stake value
    });

    const txParams = {
        nonce        : 22,                  //
        chainId      : chain.networkId(),   //
        gasCoin      : 0,                   //
        gasPrice     : 1,                   //
        type         : txAction.type(),     //
        data         : txAction.serialize(),//
        signatureType: minterApi.SignatureType.Single,
    };

    const tx = new minterApi.Transaction(txParams);
    const signedTx = tx.sign(keyPair);

    const txRawBuf = Buffer.from(TX_RLP_ENCODED, 'hex');
    const txMtHash = 'Mt' + sha256(txRawBuf).toString('hex').toLowerCase();

    expect(signedTx.signature.valid()).toBeTruthy();
    expect(signedTx.transaction.serialize().toString('hex')).toEqual(TX_RLP_ENCODED);
    expect(txMtHash).toEqual(TX_HASH);
});

//
test('[TxSingle] DeclareCandidacy transaction type', async () => {
    const TX_RLP_ENCODED = 'f8961602018006b845f843940bd4dd45fc7072ce6f1a4b297706174ee2f86910a06787a7adfed250d13cd089db516e274d71f105f4e6a0639e0f9521985ea6c2010f808a152d02c7e14af6800000808001b845f8431ba01817f26876111249856a94b9bee59840f959a871dd3c4b623eb425d785e08ff2a07272ad227ecf062763b28b557b82f1237f1a1d5f799cc0c2280cb58c9bd26a2d';
    const TX_HASH = 'Mt2047a7d0121f9d3d95b79fdf0d516cde06b5f9daaa81860e7585b76029593b2f';

    const utils = minterApi.utils;
    const sha256 = utils.sha256;
    const convertBipToPip = utils.convertBipToPip;

    const chain = new minterApi.Chain('testnet');
    const keyPair = minterApi.KeyPairSecp256k1.fromBip39Mnemonic(MNEMONIC);

    const txAction = new minterApi.tx_actions.DeclareCandidacyAction({
        address   : 'Mx0bd4dd45fc7072ce6f1a4b297706174ee2f86910', // Validator owner  address Mx.............
        publicKey : 'Mp6787a7adfed250d13cd089db516e274d71f105f4e6a0639e0f9521985ea6c201', // Validator node pub key Mp.............
        commission: 15, // 0-100 %
        coin      : 0, // Coin ID .Initial self bonded Stake coin
        stake     : convertBipToPip(100_000), // PIP units Stake value
    });

    const txParams = {
        nonce        : 22,                  //
        chainId      : chain.networkId(),   //
        gasCoin      : 0,                   //
        gasPrice     : 1,                   //
        type         : txAction.type(),     //
        data         : txAction.serialize(),//
        signatureType: minterApi.SignatureType.Single,
    };

    const tx = new minterApi.Transaction(txParams);
    const signedTx = tx.sign(keyPair);

    const txRawBuf = Buffer.from(TX_RLP_ENCODED, 'hex');
    const txMtHash = 'Mt' + sha256(txRawBuf).toString('hex').toLowerCase();

    expect(signedTx.signature.valid()).toBeTruthy();
    expect(signedTx.transaction.serialize().toString('hex')).toEqual(TX_RLP_ENCODED);
    expect(txMtHash).toEqual(TX_HASH);
});

//
test('[TxSingle] EditCandidate transaction type', async () => {
    const TX_RLP_ENCODED = 'f8b3170201800eb862f860a06787a7adfed250d13cd089db516e274d71f105f4e6a0639e0f9521985ea6c20194eb92ae39b84012968f63b2dd260a94d791fe79bd940bd4dd45fc7072ce6f1a4b297706174ee2f8691094eb92ae39b84012968f63b2dd260a94d791fe79bd808001b845f8431ca03f668ca5c7d3b46448bc360cc963621dce777401064ba9ec19cfd5be8816ee3ba04f51215a0bd3bf87abcc1ccc887d92031861c4c38012bdaa5190c8c6a38a2f8b';
    const TX_HASH = 'Mt3a92f9c7d56d51d78f62529d7ddb625d3833a3ebf8879d421fae0ef79fbd4422';

    const utils = minterApi.utils;
    const sha256 = utils.sha256;

    const chain = new minterApi.Chain('testnet');
    const keyPair = minterApi.KeyPairSecp256k1.fromBip39Mnemonic(MNEMONIC);

    const txAction = new minterApi.tx_actions.EditCandidateAction({
        ownerAddress  : 'Mx0bd4dd45fc7072ce6f1a4b297706174ee2f86910', // Validator owner  address Mx.............
        controlAddress: 'Mxeb92ae39b84012968f63b2dd260a94d791fe79bd', // Validator owner  address Mx.............
        rewardAddress : 'Mxeb92ae39b84012968f63b2dd260a94d791fe79bd', // Validator owner  address Mx.............
        publicKey     : 'Mp6787a7adfed250d13cd089db516e274d71f105f4e6a0639e0f9521985ea6c201', // Validator node pub key Mp.............
    });

    const txParams = {
        nonce        : 23,                  //
        chainId      : chain.networkId(),   //
        gasCoin      : 0,                   //
        gasPrice     : 1,                   //
        type         : txAction.type(),     //
        data         : txAction.serialize(),//
        signatureType: minterApi.SignatureType.Single,
    };

    const tx = new minterApi.Transaction(txParams);
    const signedTx = tx.sign(keyPair);

    const txRawBuf = Buffer.from(TX_RLP_ENCODED, 'hex');
    const txMtHash = 'Mt' + sha256(txRawBuf).toString('hex').toLowerCase();

    expect(signedTx.signature.valid()).toBeTruthy();
    expect(signedTx.transaction.serialize().toString('hex')).toEqual(TX_RLP_ENCODED);
    expect(txMtHash).toEqual(TX_HASH);
});

//
test('[TxSingle] EditCandidatePubKey transaction type', async () => {
    const TX_RLP_ENCODED = 'f8951802018014b844f842a06787a7adfed250d13cd089db516e274d71f105f4e6a0639e0f9521985ea6c201a0aaaaa16ebd6af229b4cfc02c3ab40bd25c1051c3aa2120f07d08c1bd01777778808001b845f8431ca06efae27e55af3ddf8d934d0362761a6aacd32e5a33da3475315442d5e1520276a054e9562fa5e311ef1b3eeb6d6fdb12aa21225da1f472a3f3866f99cb1f1e4a3d';
    const TX_HASH = 'Mt10997b9e4b713413e99e92ab442ce56414d10623a871a8baf6de230824ce5bf7';

    const utils = minterApi.utils;
    const sha256 = utils.sha256;

    const chain = new minterApi.Chain('testnet');
    const keyPair = minterApi.KeyPairSecp256k1.fromBip39Mnemonic(MNEMONIC);

    const txAction = new minterApi.tx_actions.EditCandidatePubKeyAction({
        publicKey   : 'Mp6787a7adfed250d13cd089db516e274d71f105f4e6a0639e0f9521985ea6c201', // Validator node pub key Mp.............
        newPublicKey: 'Mpaaaaa16ebd6af229b4cfc02c3ab40bd25c1051c3aa2120f07d08c1bd01777778', // Validator node pub key Mp.............
    });

    const txParams = {
        nonce        : 24,                  //
        chainId      : chain.networkId(),   //
        gasCoin      : 0,                   //
        gasPrice     : 1,                   //
        type         : txAction.type(),     //
        data         : txAction.serialize(),//
        signatureType: minterApi.SignatureType.Single,
    };

    const tx = new minterApi.Transaction(txParams);
    const signedTx = tx.sign(keyPair);

    const txRawBuf = Buffer.from(TX_RLP_ENCODED, 'hex');
    const txMtHash = 'Mt' + sha256(txRawBuf).toString('hex').toLowerCase();

    expect(signedTx.signature.valid()).toBeTruthy();
    expect(signedTx.transaction.serialize().toString('hex')).toEqual(TX_RLP_ENCODED);
    expect(txMtHash).toEqual(TX_HASH);
});

//
test('[TxSingle] EditCandidateCommission transaction type', async () => {
    const TX_RLP_ENCODED = 'f873190201801aa3e2a0aaaaa16ebd6af229b4cfc02c3ab40bd25c1051c3aa2120f07d08c1bd0177777805808001b845f8431ba07672a88d5346065860302fa4f1a0f9c64d76fabdf7e167b62ae8d5c25a588754a029c722696325bbdd5e0c4323a42b75ca233a61cc943931965388e0b59312270b';
    const TX_HASH = 'Mt629fd4a701aaf451cffe91b7365261427988fdd887e96be34d62bdf4be608e53';

    const utils = minterApi.utils;
    const sha256 = utils.sha256;

    const chain = new minterApi.Chain('testnet');
    const keyPair = minterApi.KeyPairSecp256k1.fromBip39Mnemonic(MNEMONIC);

    const txAction = new minterApi.tx_actions.EditCandidateCommissionAction({
        publicKey : 'Mpaaaaa16ebd6af229b4cfc02c3ab40bd25c1051c3aa2120f07d08c1bd01777778', // Validator node pub key Mp.............
        commission: 5, //  0-100 %
    });

    const txParams = {
        nonce        : 25,                  //
        chainId      : chain.networkId(),   //
        gasCoin      : 0,                   //
        gasPrice     : 1,                   //
        type         : txAction.type(),     //
        data         : txAction.serialize(),//
        signatureType: minterApi.SignatureType.Single,
    };

    const tx = new minterApi.Transaction(txParams);
    const signedTx = tx.sign(keyPair);

    const txRawBuf = Buffer.from(TX_RLP_ENCODED, 'hex');
    const txMtHash = 'Mt' + sha256(txRawBuf).toString('hex').toLowerCase();

    expect(signedTx.signature.valid()).toBeTruthy();
    expect(signedTx.transaction.serialize().toString('hex')).toEqual(TX_RLP_ENCODED);
    expect(txMtHash).toEqual(TX_HASH);
});

//
test('[TxSingle] Delegate transaction type', async () => {
    const TX_RLP_ENCODED = 'f87e1a02018007aeeda0aaaaa16ebd6af229b4cfc02c3ab40bd25c1051c3aa2120f07d08c1bd01777778808a021e19e0c9bab2400000808001b845f8431ba0905165ce59798bf21809329b3384b067672223d9adc7ed62950595b05943997ba051db055003d5a9b647e6e3cdd5705f7cde126af0021920ed99fb0a47181339da';
    const TX_HASH = 'Mtdb74dca128c31cb41cbf348e550f322b56665151201d7f7a5e15d99f78619a30';

    const utils = minterApi.utils;
    const sha256 = utils.sha256;
    const convertBipToPip = utils.convertBipToPip;

    const chain = new minterApi.Chain('testnet');
    const keyPair = minterApi.KeyPairSecp256k1.fromBip39Mnemonic(MNEMONIC);

    const txAction = new minterApi.tx_actions.DelegateAction({
        publicKey: 'Mpaaaaa16ebd6af229b4cfc02c3ab40bd25c1051c3aa2120f07d08c1bd01777778', // Validator node pub key Mp.............
        coin     : 0, //  Coin ID
        stake    : convertBipToPip(10_000), // PIP units to Stake value
    });

    const txParams = {
        nonce        : 26,                  //
        chainId      : chain.networkId(),   //
        gasCoin      : 0,                   //
        gasPrice     : 1,                   //
        type         : txAction.type(),     //
        data         : txAction.serialize(),//
        signatureType: minterApi.SignatureType.Single,
    };

    const tx = new minterApi.Transaction(txParams);
    const signedTx = tx.sign(keyPair);

    const txRawBuf = Buffer.from(TX_RLP_ENCODED, 'hex');
    const txMtHash = 'Mt' + sha256(txRawBuf).toString('hex').toLowerCase();

    expect(signedTx.signature.valid()).toBeTruthy();
    expect(signedTx.transaction.serialize().toString('hex')).toEqual(TX_RLP_ENCODED);
    expect(txMtHash).toEqual(TX_HASH);
});

//
test('[TxSingle] Unbond transaction type', async () => {
    const TX_RLP_ENCODED = 'f87e1e02018008aeeda0aaaaa16ebd6af229b4cfc02c3ab40bd25c1051c3aa2120f07d08c1bd01777778808a01e7e4171bf4d3a00000808001b845f8431ba073b6829d7fe9bc31ca108e3300cfac1527e344cb091434df735839ad42de0c0ba044bab2f4e732743b077692204357b74d54abed757a6c649ff0e7cc888ac61aa8';
    const TX_HASH = 'Mt2e64d0c08979037090dbb6643bc915ff1f1b4cda01d6af72edf31a3f633dd829';

    const utils = minterApi.utils;
    const sha256 = utils.sha256;
    const convertBipToPip = utils.convertBipToPip;

    const chain = new minterApi.Chain('testnet');
    const keyPair = minterApi.KeyPairSecp256k1.fromBip39Mnemonic(MNEMONIC);

    const txAction = new minterApi.tx_actions.UnbondAction({
        publicKey: 'Mpaaaaa16ebd6af229b4cfc02c3ab40bd25c1051c3aa2120f07d08c1bd01777778', // Validator node pub key Mp.............
        coin     : 0, //  Coin ID
        stake    : convertBipToPip(9_000), // PIP units to Stake value
    });

    const txParams = {
        nonce        : 30,                              //
        chainId      : chain.networkId(),               //
        gasCoin      : 0,                               //
        gasPrice     : 1,                               //
        type         : txAction.type(),                 //
        data         : txAction.serialize(),            //
        signatureType: minterApi.SignatureType.Single,  //
    };

    const tx = new minterApi.Transaction(txParams);
    const signedTx = tx.sign(keyPair);

    const txRawBuf = Buffer.from(TX_RLP_ENCODED, 'hex');
    const txMtHash = 'Mt' + sha256(txRawBuf).toString('hex').toLowerCase();

    expect(signedTx.signature.valid()).toBeTruthy();
    expect(signedTx.transaction.serialize().toString('hex')).toEqual(TX_RLP_ENCODED);
    expect(txMtHash).toEqual(TX_HASH);
});

//
// test('[TxSingle] MoveStake transaction type', async () => {
//     const TX_RLP_ENCODED = '';
//     const TX_HASH = '';
//
//     const utils = minterApi.utils;
//     const sha256 = utils.sha256;
//     const convertBipToPip = utils.convertBipToPip;
//
//     const chain = new minterApi.Chain('testnet');
//     const keyPair = minterApi.KeyPairSecp256k1.fromBip39Mnemonic(MNEMONIC);
//
//     const txAction = new minterApi.tx_actions.MoveStakeAction({
//         from: 'Mpaaaaa16ebd6af229b4cfc02c3ab40bd25c1051c3aa2120f07d08c1bd01777778', // Validator node pub key  Mp.............
//         to: 'Mpaaaaa16ebd6af229b4cfc02c3ab40bd25c1051c3aa2120f07d08c1bd01777777', // Validator node pub key    Mp.............
//         coin     : 0, //  Coin ID
//         stake    : convertBipToPip(500), // PIP units to Stake value
//     });
//
//     const txParams = {
//         nonce        : 28,                              //
//         chainId      : chain.networkId(),               //
//         gasCoin      : 0,                               //
//         gasPrice     : 1,                               //
//         type         : txAction.type(),                 //
//         data         : txAction.serialize(),            //
//         signatureType: minterApi.SignatureType.Single,  //
//     };
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

//
test('[TxSingle] SetCandidateOn transaction type', async () => {
    const TX_RLP_ENCODED = 'f8721c0201800aa2e1a0aaaaa16ebd6af229b4cfc02c3ab40bd25c1051c3aa2120f07d08c1bd01777778808001b845f8431ca0449e0fe18941ab151fd2cab35d0b63af091e5d56f707ba6d46b5b5d22330dbc4a03691c04d3c69283b0674c48d7212b80bcfdecb7120338c60b7b130964a575987';
    const TX_HASH = 'Mt82a25298d614f12aacc06119d73265c3131abf6f085e14bc62c457d3897bc081';

    const utils = minterApi.utils;
    const sha256 = utils.sha256;

    const chain = new minterApi.Chain('testnet');
    const keyPair = minterApi.KeyPairSecp256k1.fromBip39Mnemonic(MNEMONIC);

    const txAction = new minterApi.tx_actions.SetCandidateOnAction({
        publicKey: 'Mpaaaaa16ebd6af229b4cfc02c3ab40bd25c1051c3aa2120f07d08c1bd01777778', // Validator node pub key Mp.............
    });

    const txParams = {
        nonce        : 28,                              //
        chainId      : chain.networkId(),               //
        gasCoin      : 0,                               //
        gasPrice     : 1,                               //
        type         : txAction.type(),                 //
        data         : txAction.serialize(),            //
        signatureType: minterApi.SignatureType.Single,  //
    };

    const tx = new minterApi.Transaction(txParams);
    const signedTx = tx.sign(keyPair);

    const txRawBuf = Buffer.from(TX_RLP_ENCODED, 'hex');
    const txMtHash = 'Mt' + sha256(txRawBuf).toString('hex').toLowerCase();

    expect(signedTx.signature.valid()).toBeTruthy();
    expect(signedTx.transaction.serialize().toString('hex')).toEqual(TX_RLP_ENCODED);
    expect(txMtHash).toEqual(TX_HASH);
});

//
test('[TxSingle] SetCandidateOff transaction type', async () => {
    const TX_RLP_ENCODED = 'f8721d0201800ba2e1a0aaaaa16ebd6af229b4cfc02c3ab40bd25c1051c3aa2120f07d08c1bd01777778808001b845f8431ca006ac864ba76f1fc381e0e2fe42bcc07e71390cb92e960e5a4533e76a5b738688a05e236bb0ecea0389dc3f2c41908a9dd6f942b0d515552cbf773e37eb8ff184d2';
    const TX_HASH = 'Mtcab90f65b77e22e4252641a159a82b0bd5ee21e94a15ec884bc61c0cf717f90b';

    const utils = minterApi.utils;
    const sha256 = utils.sha256;

    const chain = new minterApi.Chain('testnet');
    const keyPair = minterApi.KeyPairSecp256k1.fromBip39Mnemonic(MNEMONIC);

    const txAction = new minterApi.tx_actions.SetCandidateOffAction({
        publicKey: 'Mpaaaaa16ebd6af229b4cfc02c3ab40bd25c1051c3aa2120f07d08c1bd01777778', // Validator node pub key Mp.............
    });

    const txParams = {
        nonce        : 29,                              //
        chainId      : chain.networkId(),               //
        gasCoin      : 0,                               //
        gasPrice     : 1,                               //
        type         : txAction.type(),                 //
        data         : txAction.serialize(),            //
        signatureType: minterApi.SignatureType.Single,  //
    };

    const tx = new minterApi.Transaction(txParams);
    const signedTx = tx.sign(keyPair);

    const txRawBuf = Buffer.from(TX_RLP_ENCODED, 'hex');
    const txMtHash = 'Mt' + sha256(txRawBuf).toString('hex').toLowerCase();

    expect(signedTx.signature.valid()).toBeTruthy();
    expect(signedTx.transaction.serialize().toString('hex')).toEqual(TX_RLP_ENCODED);
    expect(txMtHash).toEqual(TX_HASH);
});

//
test('[TxSingle] VoteHaltBlock transaction type', async () => {
    const TX_RLP_ENCODED = 'f8761f0201800fa6e5a0aaaaa16ebd6af229b4cfc02c3ab40bd25c1051c3aa2120f07d08c1bd01777778835fea29808001b845f8431ba0597f0111554a56c69cc57c59ee9f471de1fea8a9e767fa2b6329a61cc21a4419a048cfcc13cabcf4a0e1437dcaab6988c76dc7cdc9099ef4fdbe79a894cf00a542';
    const TX_HASH = 'Mt5c2aa9c2ad4df7c7f998fe3b76ebce5eeb8896c99d3ce2aea0fcdc3068fb79ee';

    const utils = minterApi.utils;
    const sha256 = utils.sha256;

    const chain = new minterApi.Chain('testnet');
    const keyPair = minterApi.KeyPairSecp256k1.fromBip39Mnemonic(MNEMONIC);

    const txAction = new minterApi.tx_actions.VoteHaltBlockAction({
        publicKey: 'Mpaaaaa16ebd6af229b4cfc02c3ab40bd25c1051c3aa2120f07d08c1bd01777778', // Validator node pub key Mp.............
        height   : 6285865, // Block height
    });

    const txParams = {
        nonce        : 31,                              //
        chainId      : chain.networkId(),               //
        gasCoin      : 0,                               //
        gasPrice     : 1,                               //
        type         : txAction.type(),                 //
        data         : txAction.serialize(),            //
        signatureType: minterApi.SignatureType.Single,  //
    };

    const tx = new minterApi.Transaction(txParams);
    const signedTx = tx.sign(keyPair);

    const txRawBuf = Buffer.from(TX_RLP_ENCODED, 'hex');
    const txMtHash = 'Mt' + sha256(txRawBuf).toString('hex').toLowerCase();

    expect(signedTx.signature.valid()).toBeTruthy();
    expect(signedTx.transaction.serialize().toString('hex')).toEqual(TX_RLP_ENCODED);
    expect(txMtHash).toEqual(TX_HASH);
});

//
test('[TxSingle] VoteNetUpdate transaction type', async () => {
    const TX_RLP_ENCODED = 'f87b2002018021abea8476325f35a0aaaaa16ebd6af229b4cfc02c3ab40bd25c1051c3aa2120f07d08c1bd01777778835fea29808001b845f8431ca0e062ec3c503e64ae06d85efe9ddf7f323cd2ce41548325644fc3722ec9e19469a076861579176fa9b54c05951a128585c39d0bbde9871b0d25524aed1bece6e30a';
    const TX_HASH = 'Mt573909ba46082ae61014ab57392aa8af46c936c854c946d8dbd5101d30ae9df1';

    const utils = minterApi.utils;
    const sha256 = utils.sha256;

    const chain = new minterApi.Chain('testnet');
    const keyPair = minterApi.KeyPairSecp256k1.fromBip39Mnemonic(MNEMONIC);

    const txAction = new minterApi.tx_actions.VoteNetUpdateAction({
        publicKey: 'Mpaaaaa16ebd6af229b4cfc02c3ab40bd25c1051c3aa2120f07d08c1bd01777778', // Validator node pub key Mp.............
        height   : 6285865, // Block height
        version  : 'v2_5',  // New version update to ("/^[a-zA-Z0-9_]{1,20}$/")
    });

    const txParams = {
        nonce        : 32,                              //
        chainId      : chain.networkId(),               //
        gasCoin      : 0,                               //
        gasPrice     : 1,                               //
        type         : txAction.type(),                 //
        data         : txAction.serialize(),            //
        signatureType: minterApi.SignatureType.Single,  //
    };

    const tx = new minterApi.Transaction(txParams);
    const signedTx = tx.sign(keyPair);

    const txRawBuf = Buffer.from(TX_RLP_ENCODED, 'hex');
    const txMtHash = 'Mt' + sha256(txRawBuf).toString('hex').toLowerCase();

    expect(signedTx.signature.valid()).toBeTruthy();
    expect(signedTx.transaction.serialize().toString('hex')).toEqual(TX_RLP_ENCODED);
    expect(txMtHash).toEqual(TX_HASH);
});

//
test('[TxSingle] VoteCommissionUpdate transaction type', async () => {
    const TX_RLP_ENCODED = 'f902222102018020b901d0f901cda0aaaaa16ebd6af229b4cfc02c3ab40bd25c1051c3aa2120f07d08c1bd01777778835ff9c90889056bc75e2d6310000089056bc75e2d6310000089056bc75e2d6310000089056bc75e2d6310000089056bc75e2d6310000089056bc75e2d6310000089056bc75e2d6310000089056bc75e2d6310000089056bc75e2d6310000089056bc75e2d6310000089056bc75e2d6310000089056bc75e2d6310000089056bc75e2d6310000089056bc75e2d6310000089056bc75e2d6310000089056bc75e2d6310000089056bc75e2d6310000089056bc75e2d6310000089056bc75e2d6310000089056bc75e2d6310000089056bc75e2d6310000089056bc75e2d6310000089056bc75e2d6310000089056bc75e2d6310000089056bc75e2d6310000089056bc75e2d6310000089056bc75e2d6310000089056bc75e2d6310000089056bc75e2d6310000089056bc75e2d6310000089056bc75e2d6310000089056bc75e2d6310000089056bc75e2d6310000089056bc75e2d6310000089056bc75e2d6310000089056bc75e2d6310000089056bc75e2d6310000089056bc75e2d6310000089056bc75e2d6310000089056bc75e2d6310000089056bc75e2d6310000089056bc75e2d63100000808080808001b845f8431ca0dc6223b211eef152924e5a383193e15c5270d6face32709b50dc23e085302161a03e5eec9259d0b8894face66bbd41c6117fdaa7fb6e8075bb87e862af483636fc';
    const TX_HASH = 'Mtc5187f88e6163016effa368fb98b7453f5a0b7d49214bd461a1b5db8b9044df9';

    const utils = minterApi.utils;
    const sha256 = utils.sha256;
    const convertBipToPip = utils.convertBipToPip;

    const chain = new minterApi.Chain('testnet');
    const keyPair = minterApi.KeyPairSecp256k1.fromBip39Mnemonic(MNEMONIC);

    const txAction = new minterApi.tx_actions.VoteCommissionUpdateAction({
        publicKey              : 'Mpaaaaa16ebd6af229b4cfc02c3ab40bd25c1051c3aa2120f07d08c1bd01777778', // Validator node pub key Mp.............
        height                 : 6289865,   // Block height
        coin                   : 8,      // Commission coin Id
        addLiquidity           : convertBipToPip(100),  // New Price
        burnToken              : convertBipToPip(100),  // New Price
        buyBancor              : convertBipToPip(100),  // New Price
        buyPoolBase            : convertBipToPip(100),  // New Price
        buyPoolDelta           : convertBipToPip(100),  // New Price
        createCoin             : convertBipToPip(100),  // New Price
        createMultisig         : convertBipToPip(100),  // New Price
        createSwapPool         : convertBipToPip(100),  // New Price
        createTicker3          : convertBipToPip(100),  // New Price
        createTicker4          : convertBipToPip(100),  // New Price
        createTicker5          : convertBipToPip(100),  // New Price
        createTicker6          : convertBipToPip(100),  // New Price
        createTicker7to10      : convertBipToPip(100),  // New Price
        createToken            : convertBipToPip(100),  // New Price
        declareCandidacy       : convertBipToPip(100),  // New Price
        delegate               : convertBipToPip(100),  // New Price
        editCandidate          : convertBipToPip(100),  // New Price
        editCandidateCommission: convertBipToPip(100),  // New Price
        editCandidatePublicKey : convertBipToPip(100),  // New Price
        editMultisig           : convertBipToPip(100),  // New Price
        editTickerOwner        : convertBipToPip(100),  // New Price
        mintToken              : convertBipToPip(100),  // New Price
        multisendBase          : convertBipToPip(100),  // New Price
        multisendDelta         : convertBipToPip(100),  // New Price
        payloadByte            : convertBipToPip(100),  // New Price
        recreateCoin           : convertBipToPip(100),  // New Price
        recreateToken          : convertBipToPip(100),  // New Price
        redeemCheck            : convertBipToPip(100),  // New Price
        removeLiquidity        : convertBipToPip(100),  // New Price
        sellAllBancor          : convertBipToPip(100),  // New Price
        sellAllPoolBase        : convertBipToPip(100),  // New Price
        sellAllPoolDelta       : convertBipToPip(100),  // New Price
        sellBancor             : convertBipToPip(100),  // New Price
        sellPoolBase           : convertBipToPip(100),  // New Price
        sellPoolDelta          : convertBipToPip(100),  // New Price
        send                   : convertBipToPip(100),  // New Price
        setCandidateOff        : convertBipToPip(100),  // New Price
        setCandidateOn         : convertBipToPip(100),  // New Price
        setHaltBlock           : convertBipToPip(100),  // New Price
        unbond                 : convertBipToPip(100),  // New Price
        voteCommission         : convertBipToPip(100),  // New Price
        voteUpdate             : convertBipToPip(100),  // New Price
        failedTx               : undefined, // Default 0
        addLimitOrder          : undefined, // Default 0
        removeLimitOrder       : undefined, // Default 0
    });

    const txParams = {
        nonce        : 33,                              //
        chainId      : chain.networkId(),               //
        gasCoin      : 0,                               //
        gasPrice     : 1,                               //
        type         : txAction.type(),                 //
        data         : txAction.serialize(),            //
        signatureType: minterApi.SignatureType.Single,  //
    };

    const tx = new minterApi.Transaction(txParams);
    const signedTx = tx.sign(keyPair);

    const txRawBuf = Buffer.from(TX_RLP_ENCODED, 'hex');
    const txMtHash = 'Mt' + sha256(txRawBuf).toString('hex').toLowerCase();

    expect(signedTx.signature.valid()).toBeTruthy();
    expect(signedTx.transaction.serialize().toString('hex')).toEqual(TX_RLP_ENCODED);
    expect(txMtHash).toEqual(TX_HASH);
});

//
test('[TxSingle] CreateMultiSig transaction type', async () => {
    const TX_RLP_ENCODED = 'f880220201800cb0ef3cc23c28ea940bd4dd45fc7072ce6f1a4b297706174ee2f86910940bd4dd45fc7072ce6f1a4b297706174ee2f86911808001b845f8431ca0ed80638f4af808bc9dd69b9ad9de141ac7e9d3b55bda0ac7daac3efcdbe85282a027f60a177970f02f56361c6aa9ed6f6812d33c4b4c4a4ed59d466e00d30cf4ed';
    const TX_HASH = 'Mtff54f45a31aa302f3fccb7e3c3d7c83538e736b8441f4ee875dae2ad4480d5b6';

    const utils = minterApi.utils;
    const sha256 = utils.sha256;

    const chain = new minterApi.Chain('testnet');
    const keyPair = minterApi.KeyPairSecp256k1.fromBip39Mnemonic(MNEMONIC);

    const txAction = new minterApi.tx_actions.CreateMultiSigAction({
        addresses: [
            'Mx0bd4dd45fc7072ce6f1a4b297706174ee2f86910',
            'Mx0bd4dd45fc7072ce6f1a4b297706174ee2f86911',
        ],
        weights  : [60, 40],
        threshold: 60,
    });

    const txParams = {
        nonce        : 34,                              //
        chainId      : chain.networkId(),               //
        gasCoin      : 0,                               //
        gasPrice     : 1,                               //
        type         : txAction.type(),                 //
        data         : txAction.serialize(),            //
        signatureType: minterApi.SignatureType.Single,  //
    };

    const tx = new minterApi.Transaction(txParams);
    const signedTx = tx.sign(keyPair);

    const txRawBuf = Buffer.from(TX_RLP_ENCODED, 'hex');
    const txMtHash = 'Mt' + sha256(txRawBuf).toString('hex').toLowerCase();

    expect(signedTx.signature.valid()).toBeTruthy();
    expect(signedTx.transaction.serialize().toString('hex')).toEqual(TX_RLP_ENCODED);
    expect(txMtHash).toEqual(TX_HASH);
});


//
// //
// test('[TxSingle] EditMultiSig transaction type', async () => {
//     const TX_RLP_ENCODED = '';
//     const ACC_PRIV_KEY= 'secp256k1:oYHhCijezmKqxduKENqWnkMYCuAeYZugduz3WusG1SjBVVQia';
//     const ACC_PRIV_KEY_1 = 'secp256k1:sBhbNEFES9F3onTAqHLsUjSNusVLCyHb7J4RC2q6Ve8b3i9qc';
//     const TX_SIG_ACC = '';
//     const TX_SIG_ACC_1 = '';
//
//     const utils = minterApi.utils;
//     const sha256 = utils.sha256;
//
//     const chain = new minterApi.Chain('testnet');
//     const keyPair = minterApi.KeyPairSecp256k1.fromString(ACC_PRIV_KEY);
//     const keyPair1 = minterApi.KeyPairSecp256k1.fromString(ACC_PRIV_KEY_1);
//
//     // TODO: Создаем транзу редактирования мультисига на кошкльке A
//     // TODO: Создаем транзу редактирования мультисига на кошкльке B ( транзы 1 и2 полностью совпадают)
//     // TODO: Создаем транзу мультисига с 2-мя подписями!
//     const txAction = new minterApi.tx_actions.EditMultiSigAction({
//         addresses: [
//             'Mx0bd4dd45fc7072ce6f1a4b297706174ee2f86910',
//             'Mxf6b410929fc83721c0ce6bc7263ee6d9f8f3ffe7',
//         ],
//         weights  : [50, 40],
//         threshold: 50,
//     });
//
//     const txParams = {
//         nonce        : 35,                              //
//         chainId      : chain.networkId(),               //
//         gasCoin      : 0,                               //
//         gasPrice     : 1,                               //
//         type         : txAction.type(),                 //
//         data         : txAction.serialize(),            //
//         signatureType: minterApi.SignatureType.Single,  //
//     };
//
//     const tx = new minterApi.Transaction(txParams);
//     const signedTx = tx.sign(keyPair);
//     const signedTx1 = tx.sign(keyPair1);
//
//     const txParams = {
//         nonce        : 35,                              //
//         chainId      : chain.networkId(),               //
//         gasCoin      : 0,                               //
//         gasPrice     : 1,                               //
//         type         : txAction.type(),                 //
//         data         : txAction.serialize(),            //
//         signatureType: minterApi.SignatureType.Multi,  //
//     };
//
//     const txRawBuf = Buffer.from(TX_RLP_ENCODED, 'hex');
//     const txMtHash = 'Mt' + sha256(txRawBuf).toString('hex').toLowerCase();
//
//
//     expect(signedTx.signature.valid()).toBeTruthy();
//     expect(signedTx.signature.valid()).toBeTruthy();
//     expect(signedTx.transaction.serialize().toString('hex')).toEqual(TX_RLP_ENCODED);
//     expect(txMtHash).toEqual(TX_HASH);
// });

// //
// test('[TxSingle] AddLimitOrder transaction type', async () => {
//     const TX_RLP_ENCODED = '';
//     const TX_HASH = '';
//
//     const utils = minterApi.utils;
//     const sha256 = utils.sha256;
//     const convertBipToPip = utils.convertBipToPip;
//
//     const chain = new minterApi.Chain('testnet');
//     const keyPair = minterApi.KeyPairSecp256k1.fromBip39Mnemonic(MNEMONIC);
//
//     const txAction = new minterApi.tx_actions.AddLimitOrderAction({
//         coinToBuy  : 8,      // Commission coin Id
//         valueToBuy : convertBipToPip(100),
//         coinToSell : 0,      // Commission coin Id
//         valueToSell: convertBipToPip(100),
//     });
//
//     const txParams = {
//         nonce        : 34,                              //
//         chainId      : chain.networkId(),               //
//         gasCoin      : 0,                               //
//         gasPrice     : 1,                               //
//         type         : txAction.type(),                 //
//         data         : txAction.serialize(),            //
//         signatureType: minterApi.SignatureType.Single,  //
//     };
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
//
// //
// test('[TxSingle] RemoveLimitOrder transaction type', async () => {
//     const TX_RLP_ENCODED = '';
//     const TX_HASH = '';
//
//     const utils = minterApi.utils;
//     const sha256 = utils.sha256;
//
//     const chain = new minterApi.Chain('testnet');
//     const keyPair = minterApi.KeyPairSecp256k1.fromBip39Mnemonic(MNEMONIC);
//
//     const txAction = new minterApi.tx_actions.RemoveLimitOrderAction({
//         orderId  : 8,      //
//     });
//
//     const txParams = {
//         nonce        : 35,                              //
//         chainId      : chain.networkId(),               //
//         gasCoin      : 0,                               //
//         gasPrice     : 1,                               //
//         type         : txAction.type(),                 //
//         data         : txAction.serialize(),            //
//         signatureType: minterApi.SignatureType.Single,  //
//     };
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
