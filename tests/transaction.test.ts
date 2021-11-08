import {TransactionParams} from '../src/transaction/transaction';
import * as minterApi from '../src';

const ACC_MNEMONIC = 'solar when satoshi champion about zebra crop solution leopard senior ability vocal';
// const ACC_PUB_KEY='secp256k1:WWjcQcvUjNi9AC5Y6zQGLYQy64mL1C3dnZgGZ3HfC28B9R22WFuuNpj8d14dUDJ1MsCSUkPbPrpExXh8vMbt5Vo9TtmC9';
// const ACC_ADDRESS ='Mx0bd4dd45fc7072ce6f1a4b297706174ee2f86910';

const TX_RLP_ENCODED = 'f8710202018001a1e08094eb92ae39b84012968f63b2dd260a94d791fe79bd89056bc75e2d63100000000001b845f8431ba0384e5516462774e67c1efc016458af86e68f3780fadcb27c3587389dd36056e8a003b0f7547aee983bdcdcf76334d169dee271ffd96e9cb2284a68cfb1e54cedb0';
const TX_SENDER_ADDRESS = 'Mx0bd4dd45fc7072ce6f1a4b297706174ee2f86910';
const TX_HASH = 'Mt4aa02f046af4d129529da272b259ffa9002893cbd88c66293d30bcdee788002d';

//
test('[Tx] Transaction from encoded string', async () => {
    const tx = new minterApi.Transaction(`0x${TX_RLP_ENCODED}`);
    const address = tx.getSenderAddress();
    expect(address.toString()).toEqual(TX_SENDER_ADDRESS);
});

//
test('[Tx] Validate transaction signature', async () => {
    const txRawBuf = Buffer.from(TX_RLP_ENCODED, 'hex');
    const tx = new minterApi.Transaction(txRawBuf);
    expect(tx.isValidSignature()).toBeTruthy();
});

//
test('[Tx] Validate transaction hash', async () => {
    const sha256 = minterApi.utils.sha256;
    const txRawBuf = Buffer.from(TX_RLP_ENCODED, 'hex');
    const txMtHash = 'Mt' + sha256(txRawBuf).toString('hex').toLowerCase();
    expect(txMtHash).toEqual(TX_HASH);
});

//
test('[TxSingle] Create single signature type transaction', async () => {
    const chain = new minterApi.Chain('testnet');
    const keyPair = minterApi.Account.fromMnemonic(ACC_MNEMONIC).keyPair;

    const txAction = new minterApi.tx_actions.SendAction({
        to   : 'Mxeb92ae39b84012968f63b2dd260a94d791fe79bd',
        coin : 0,
        value: minterApi.utils.convertBipToPip(100),
    });

    const txParams = {
        nonce        : 2,
        chainId      : chain.networkId(),
        gasCoin      : 0,
        gasPrice     : 1,
        type         : txAction.type(),
        data         : txAction.serialize(),
        payload      : '0x00',
        serviceData  : '0x00',
        signatureType: minterApi.SignatureType.Single,
    } as TransactionParams;

    const tx = new minterApi.Transaction(txParams);
    const signedTx = tx.sign(keyPair);

    expect(signedTx.signature.valid()).toBeTruthy();
    expect(signedTx.transaction.serialize().toString('hex')).toEqual(TX_RLP_ENCODED);

});
