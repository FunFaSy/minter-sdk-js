'use strict';

//import CryptoJS from 'crypto-js';
//import nacl from 'tweetnacl';
import BN from 'bn.js';
import bs58check from 'bs58check';
import * as secp256k1Shim from 'ethereum-cryptography/shims/hdkey-secp256k1v3';
import * as secp256k1 from 'ethereum-cryptography/secp256k1';
import * as sha256 from 'ethereum-cryptography/sha256';

import assert from 'assert';

export {
    bufferToInt
    , defineProperties
    , ecrecover
    , ecsign
    , rlp
    , rlphash
    , zeros
    , publicToAddress as ethPublicToAddress
    , privateToAddress as ethPrivateToAddress
    , privateToPublic as ethPrivateToPublic
    , toBuffer as ethToBuffer
    , ECDSASignature
    , ECDSASignatureBuffer
    , PrefixedHexString
    , Address as ethAddress
    , BNLike
    , BufferLike,
} from 'ethereumjs-util';

export {
    //CryptoJS
    //, nacl
    bs58check
    , secp256k1
    , secp256k1Shim
    , sha256
    //, qs
    , BN
    , assert,
};

