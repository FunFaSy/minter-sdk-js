### Quick Reference / Cheat Sheet

# Installation
```shell script
yarn add @funfasy/minter-sdk-js
#or
npm i @funfasy/minter-sdk-js
```

# Import
Node.js
```js
import * as minterSdk from '@funfasy/minter-sdk-js';
```

Browser
```html
<script src="https://unpkg.com/@funfasy/minter-sdk-js"></script>

<script>
;(function(window){
  const minterSdk = window.minterSdk;
  
  // ....
  console.log( new minterSdk.Chain(minterSdk.ChainId.TESTNET).describe() );

})(window);
</script>
```

# Usage

## Wallet & Account

### Create new mnemonic
```js
import * as minterSdk from '@funfasy/minter-sdk-js';

const minter = new minterSdk.Minter({ chainId:  minterSdk.ChainId.MAINNET });

const { wall, MNEMONIC } = await minter.newWallet(); // BIP32 HDWallet

/*OR*/

const MNEMONIC = minterSdk.Wallet.generateMnemonic();

```

### Get wallet access by mnemonic
```js
import * as minterSdk from '@funfasy/minter-sdk-js';

const minter = new minterSdk.Minter({ chainId:  minterSdk.ChainId.MAINNET });

const MNEMONIC = 'solar ... satoshi .... vocal';
const wall = await minter.walletFrom({ mnemonic: MNEMONIC }); // BIP32 HDWallet

/*OR*/
const wall = await minterSdk.Wallet.fromMnemonic(MNEMONIC);

```

### Switch network connection 
```js
import * as minterSdk from '@funfasy/minter-sdk-js';

const minterMainnet = new minterSdk.Minter({ chainId: minterSdk.ChainId.MAINNET });
const minterTestnet = new minterSdk.Minter({ chainId: minterSdk.ChainId.TESTNET });

const MNEMONIC = 'solar ... satoshi .... vocal';
const wall = await minterMain.walletFrom({ mnemonic: MNEMONIC }); // BIP32 HDWallet

await wall.setConnection(minterTestnet.connection);

/*OR*/

const chain = new minterSdk.Chain(minterSdk.ChainId.TESTNET);// ( 'mainnet' / 'testnet'/ 'taconet')
/*
* By default wallet instance connected to MAINNET
* You can switch connection on air. Derivated accounts will inherit wallet connection.
*/
const wall = await minterSdk.Wallet.fromMnemonic(MNEMONIC)
             .then(wall=>wall.setConnection(chain.newJsonRpcConnection()));
```

### Get Wallet Account
```js
import * as minterSdk from '@funfasy/minter-sdk-js';

const minter = new minterSdk.Minter({ chainId:  minterSdk.ChainId.MAINNET });

const MNEMONIC = 'solar ... satoshi .... vocal';
const wall = await minter.walletFrom({ mnemonic: MNEMONIC }); // BIP32 HDWallet

/*
* Wallet instance is BIP44 HDWallet. It mean You can derivate from single mnemonic about 2 Billons accounts(aka addresses) 
*/
// default return account index 0 for public usage. 
// Public mean you will give address some one. For send you tokens ( for example). One-off account
const pubAcc = await wall.getAccount(); 

// derivate public account by index
const pubAcc1 = await wall.getAccount(1);

// derivate private account index 0. 
// Private account means You will not share address no one. Common usage for private exchange operations 
const privAcc = await wall.getAccount(0, false);
// 
```

### Get Account State 
```js

import * as minterSdk from '@funfasy/minter-sdk-js';

const minter = new minterSdk.Minter({ chainId:  minterSdk.ChainId.MAINNET });

const MNEMONIC = 'solar ... satoshi .... vocal';
const wall = await minter.walletFrom({ mnemonic: MNEMONIC }); // BIP32 HDWallet

const acc = await wall.getAccount(); 

//
const balance = await acc.balance();
//
const waitlist = await acc.waitlist();
//
const frozen = await acc.frozen();
//
const state = await acc.state(); // Agregate balance + waitlist + frozen

```

## Transactions
### Prepare & Sign
```js
import * as minterSdk from '@funfasy/minter-sdk-js';

const minter = new minterSdk.Minter({ chainId:  minterSdk.ChainId.MAINNET });

const MNEMONIC = 'solar ... satoshi .... vocal';
const wall = await minter.walletFrom({ mnemonic: MNEMONIC }); // BIP32 HDWallet
const acc = await wall.getAccount();

const keyPair = await wall.getAccountKeyPair();

const txAction = new minterSdk.tx_actions.SendAction({
    to   : 'Mxeb92ae39b84012968f63b2dd260a94d791fe79bd',
    coin : 0,
    value: minterSdk.utils.convertBipToPip(100),
});

const txParams = {
    nonce        : await acc.nonce(),
    chainId      : chain.networkId,   //
    gasCoin      : 0,                   //
    gasPrice     : 1,                   //
    type         : txAction.type(),     //
    data         : txAction.serialize(),//
    signatureType: minterSdk.TxSignatureType.Single,
} ;

const tx = new minterSdk.Transaction(txParams);
const signedTx = await acc.signTx(tx); // .toString() return RLP serialized hex encoded  tx 

```
### Restore
```js
import * as minterSdk from '@funfasy/minter-sdk-js';

const TX_RLP_ENCODED = '0xf8710202018001a1e08094eb92ae39b84012968f63b2dd260a94d791fe79bd89056bc75e2d63100000000001b845f8431ba0384e5516462774e67c1efc016458af86e68f3780fadcb27c3587389dd36056e8a003b0f7547aee983bdcdcf76334d169dee271ffd96e9cb2284a68cfb1e54cedb0';

const tx = new minterSdk.Transaction(TX_RLP_ENCODED);
const address = tx.getSenderAddress().toString(); // > 'Mx0bd4dd45fc7072ce6f1a4b297706174ee2f86910'

```

### Send
```js
import * as minterSdk from '@funfasy/minter-sdk-js';

const minter = new minterSdk.Minter({ chainId:  minterSdk.ChainId.MAINNET });

const MNEMONIC = 'solar ... satoshi .... vocal';
const wall = await minter.walletFrom({ mnemonic: MNEMONIC }); // BIP32 HDWallet
const acc = await wall.getAccount();

const txAction = new minterSdk.tx_actions.SendAction({
    to   : 'Mxeb92ae39b84012968f63b2dd260a94d791fe79bd',
    coin : 0,
    value: minterSdk.utils.convertBipToPip(100),
});

const txParams = {
    nonce        : await acc.nonce(),
    chainId      : chain.networkId,     //
    gasCoin      : 0,                   //
    gasPrice     : 1,                   //
    type         : txAction.type(),     //
    data         : txAction.serialize(),//
    payload      : Buffer.from('Some Text'),        // or HEX string
    signatureType: minterSdk.TxSignatureType.Single,
} ;

const tx = new minterSdk.Transaction(txParams);
const txHash = await acc.signAndSendTx(tx);

```

## Key Store & KeyPairs
```js
import * as minterSdk from '@funfasy/minter-sdk-js';
/*
* By default minter wallet store keys in memory.
*/

const minter = new minterSdk.Minter({ chainId:  minterSdk.ChainId.MAINNET });

const { wall, mnemonic } = await minter.newWallet(); // BIP32 HDWallet / InMemoryKeyStore

/*
* Set up new keyStore.
* All exists accounts transfer keyPairs to new keyStore
* 
*/
await wall.setKeyStore(new minterSdk.keyStores.BrowserLocalStorageKeyStore()); 

const accKeyPair = await wall.getAccountKeyPair();

console.log(keyP.publicKey.toString());
```

## Fetch data
### Common RpcProvider usage
```js
import * as minterSdk from '@funfasy/minter-sdk-js';

const minter = new minterSdk.Minter({ chainId:  minterSdk.ChainId.MAINNET });
/*
* All available methods @see https://funfasy.github.io/minter-sdk-js/classes/providers_json_rpc_provider.jsonrpcprovider.html
*/
const height = await minter.rpc.status().then(res=>Number(res.latest_block_height));

const batch = await minter.rpc.blocks({fromHeight: height - 10, toHeight: height });

console.log(batch);
```

### Configured RpcProvider
```js
import * as minterSdk from '@funfasy/minter-sdk-js';

/*
* JsonRpcRovider extends Axios http client. So config same as the Axios
*/
const chain = new minterSdk.Chain(minterSdk.ChainId.TESTNET);
const minter = new minterSdk.Minter({ 
    chainId:  chain.chainId ,
    rpcConfig:{
      baseURL: chain.urls?.api?.node?.http[0],
      headers: {
          'Content-Type'     : 'application/json; charset=utf-8',
          'X-Project-Id'     : '<YOUR-FUNFASY-PROJECT-ID>',
          'X-Project-Secret' : '<YOUR-FUNFASY-PROJECT-SECRET>'
      },
    }
});


const height = await minter.rpc.status().then(res=>Number(res.latest_block_height));

const batch = await minter.rpc.blocks({fromHeight: height - 10, toHeight: height });

console.log(batch);

```

## Utils
### BipToPip and PipToBip formatters
```js
import * as minterSdk from '@funfasy/minter-sdk-js';

const utils = minterSdk.utils;

utils.convertBipToPip(100); // '100000000000000000000'
utils.convertBipToPip(new utils.BN('100')); // '100000000000000000000'
utils.convertBipToPip('10,000.123'); // '10000123000000000000000'

utils.convertPipToBip(new utils.BN('100000000000000000000')); // '100'
utils.convertPipToBip('100000000000000000000'); // '100'
utils.convertPipToBip('10000123000000000000000'); // '10000.123'
```
