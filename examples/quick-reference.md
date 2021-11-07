#### Create new BIP39 mnemonic
```typescript
import {Account} from "minter-api-js";
const MNEMONIC_PHRASE = Account.createBip39Mnemonic();
```


#### Account from BIP39 Mnemonic 
```typescript
import {JsonRpcProvider,InMemoryKeyStore,InMemorySigner,Connection,Chain,Account} from "minter-api-js";

const MNEMONIC_PHRASE = "air model item valley auction bullet ....";// BIP39 mnemonic phrase 
const accountId = 'primary_account';

/* Blockchain base configuration info */
const chain = new Chain('mainnet');

/* Provider with transport to server side*/
const rpcProvider = new JsonRpcProvider(chain.urls.api.http[0]);

/* Generate KeyPairSecp256k1 from privateKey issued by BIP39 HDKey set */
const keyPair = Account.keyPairFromBip39Mnemonic(MNEMONIC_PHRASE, 0/*optional id key from HDKey set*/);

/* accountId:networkId as an primary key for KeyPair*/
const keyStore = InMemoryKeyStore.fromKeyPair(chain.networkId(), accountId, keyPair);

/**/
const signer = new InMemorySigner(keyStore);

/*
 * Connects an account to a given network via a given provider
 */
const conn = new Connection(chain, rpcProvider, signer);

/**/
const account = new Account(conn, accountId);
```


#### Account from Secp256k1 privateKey ( Minter private key is Secp256k1 )

```typescript
import {JsonRpcProvider,InMemorySigner,Connection,Chain,Account,KeyPairSecp256k1} from "minter-api-js";

const PRIVATE_KEY = "0xc2cdf0a8b0a83b35ace53f097b5e6e6a0a1f2d40535eff1cf434f52a43d59d8f";// Secp256k1 private key
const accountId = 'primary_account';

/* Blockchain base configuration info*/
const chain = new Chain('mainnet');

/* Provider with transport to server side*/
const rpcProvider = new JsonRpcProvider(chain.urls.api.http[0]);

/**/
const keyPair = new KeyPairSecp256k1(PRIVATE_KEY);

/* Under the hood generate InMemoryKeyStore and set accountId:networkId as an primary key for KeyPair*/
const signer = InMemorySigner.fromKeyPair(chain.networkId(), accountId, keyPair);

/*
 * Connects an account to a given network via a given provider
 */
const conn = new Connection(chain, rpcProvider, signer);

/**/
const account = new Account(conn, accountId);
```

#### Sign and send transaction.
```typescript
import {JsonRpcProvider,InMemoryKeyStore,InMemorySigner,Connection,Chain,Account} from "minter-api-js";
import {convertToPip,BN} from "minter-api-js/src/util";

/**/
const accountId = 'primary_account';

/* Blockchain general configuration info*/
const chain = new Chain('mainnet');

/*
* !!! Assume instance of Connection created and configured
*/
const conn = new Connection(/*chain, rpcProvider, signer*/);

/**/
const account = new Account(conn, accountId);

/**
* Send 1000 BIP to adress Mx928e86d58123adc2214a4718ce9dd18bf4fe8c79
*/
/* New empty transaction */
const tx = new Transaction(undefined,{chain});
/* Seting up concreet transaction action (command to blockchain) */
const action = new SendAction({
        to    :'Mx928e86d58123adc2214a4718ce9dd18bf4fe8c79',
        coin  : 0, // coinId 
        value : convertToPip( new BN(1000)) // smallest non-divisible PIP units
      });


    tx
    .setNonce(account.provider.getNonce())
    .setAction(action) // Under th hood tx.setType(action.type), tx.setData(action.encode())
    .setGasCoin(0)  // default: 0 (Native Minter coin)
    .setGasPrice(1) // default: 1
    .setPayload("message ...") // optional
    ;

/*
*
*/
const signedTx = account.signTransaction(tx);//instance of class SignedTransaction

account.sendTransaction(signedTx)
  .then(hash=>console.log)
  .catch(err=>console.error);
/*
OR
*/
account.signAndSendTransaction(tx)
  .then(hash=>console.log)
  .catch(err=>console.error);

```
```typescript
/**/
const sha256 = minterApi.utils.sha256;
const accountId = 'primary_account';
const networkId = 'mainnet';

/* Blockchain general configuration info*/
const chain = new minterApi.Chain(networkId);

let secretKey1 = 'secp256k1:2bWofE5FJW7owdxijxBBwDQbgJkMBCxSGWeEdGcNgKxeTJcA5P';
let keyPair1 = minterApi.KeyPairSecp256k1.fromString(secretKey1)

let msg = Buffer.from("Test");
let sigMsg1 = keyPair1.sign(sha256(msg));

sigMsg1.toString()

let signer = await minterApi.InMemorySigner.fromKeyPair(networkId,accountId,keyPair1)
```
