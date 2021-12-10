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
import * as minterSdk from 'minter-sdk-js';
```

Browser
```html
<script src="https://unpkg.com/@funfasy/minter-sdk-js@latest/dist/minter-sdk-js.min.js"></script>
<!-- /#OR-->
<script src="https://unpkg.com/@funfasy/minter-sdk-js"></script>
```

# Usage

## Wallet & Account

### Create new mnemonic
```js
import * as minterSdk from 'minter-sdk-js';

const MNEMONIC = minterSdk.Wallet.generateMnemonic();
```

### Get access wallet by mnemonic
```js
import * as minterSdk from 'minter-sdk-js';

const MNEMONIC = 'solar ... satoshi .... vocal';
const wall = await minterSdk.Wallet.fromMnemonic(MNEMONIC); // BIP44 HDWallet
```

### Connect to network
```js
import * as minterSdk from 'minter-sdk-js';

const MNEMONIC = 'solar ... satoshi .... vocal';
const chain = new minterSdk.Chain(minterSdk.ChainId.TESTNET);// ( 'mainnet' / 'testnet'/ 'taconet')
/*
* By default wallet instance connected to MAINNET
* You can switch connection on air. Derivated accounts will inherit wallet connection.
*/
const wall = await minterSdk.Wallet.fromMnemonic(MNEMONIC)
             .then(wall=>wal.setConnection(chain.newJsonRpcConnection()));
```
### Get Wallet Account
```js
import * as minterSdk from 'minter-sdk-js';

const MNEMONIC = 'solar ... satoshi .... vocal';
const wall = await minterSdk.Wallet.fromMnemonic(MNEMONIC);
/*
* Wallet instance is BIP44 HDWallet. It mean You can derivate from single mnemonic about 2 Billons accounts(aka addresses) 
*/
// default return account index 0 for public usage. 
// Public mean you will give address some one. For send you tokens ( for example). One-off account
const pubAcc = await wal.getAccount(); 

// derivate public account by index
const pubAcc1 = await wal.getAccount(1);

// derivate private account index 0. 
// Private account means You will not share address no one. Common usage for private exchange operations 
const privAcc = await wal.getAccount(0, false);
// 
```

### Get Account State 
```js

import * as minterSdk from 'minter-sdk-js';

const MNEMONIC = 'solar ... satoshi .... vocal';
const wall = await minterSdk.Wallet.fromMnemonic(MNEMONIC);
const acc = await wal.getAccount(); 

//
const balance = await acc.balance();
//
const waitlist = await acc.waitlist();
//
const frozen = await acc.frozen();
//
const state = await acc.state(); // Agregate balance + waitlist + frozen

```

### Send Tokens

## Transactions
### Prepare
```js
import * as minterSdk from 'minter-sdk-js';

```
### Restore
```js
import * as minterSdk from 'minter-sdk-js';

const TX_RLP_ENCODED = '0xf8710202018001a1e08094eb92ae39b84012968f63b2dd260a94d791fe79bd89056bc75e2d63100000000001b845f8431ba0384e5516462774e67c1efc016458af86e68f3780fadcb27c3587389dd36056e8a003b0f7547aee983bdcdcf76334d169dee271ffd96e9cb2284a68cfb1e54cedb0';

const tx = new minterSdk.Transaction(TX_RLP_ENCODED);
const address = tx.getSenderAddress().toString(); // > 'Mx0bd4dd45fc7072ce6f1a4b297706174ee2f86910'

```
### Sign
```js
import * as minterSdk from 'minter-sdk-js';

```
### Send
```js
import * as minterSdk from 'minter-sdk-js';

```

## Key Store & KeyPairs

## Utils
```js
import * as minterSdk from 'minter-sdk-js';

```
