'use strict';

import {BN, bs58check, CryptoJS, ethToBuffer, qs} from '../external';
import {isMinterPrefixed, mPrefixStrip} from './prefix';

/*  ------------------------------------------------------------------------ */

const byteArrayToWordArray = (ba) => {
    const wa = [];
    for (let i = 0; i < ba.length; i++) {
        wa[(i / 4) | 0] |= ba[i] << (24 - 8 * i);
    }
    return CryptoJS.lib.WordArray.create(wa, ba.length);
};

const json                     = (data, params = undefined) => JSON.stringify(data)
    , isJsonEncodedObject      = object => (
        (typeof object === 'string') &&
          (object.length >= 2) &&
          ((object[0] === '{') || (object[0] === '['))
    )

    , stringToBinary           = string => CryptoJS.enc.Latin1.parse(string)
    , stringToBase64           = string => CryptoJS.enc.Latin1.parse(string).toString(CryptoJS.enc.Base64)
    , base64ToBinary           = string => CryptoJS.enc.Base64.parse(string)
    , base64ToString           = string => CryptoJS.enc.Base64.parse(string).toString(CryptoJS.enc.Utf8)
    , binaryToBase64           = binary => binary.toString(CryptoJS.enc.Base64)
    , base16ToBinary           = string => CryptoJS.enc.Hex.parse(string)
    , binaryToBase16           = binary => binary.toString(CryptoJS.enc.Hex)
    , binaryConcat             = (...args) => args.reduce((a, b) => a.concat(b))
    , binaryConcatArray        = (arr) => arr.reduce((a, b) => a.concat(b))

    , urlencode                = object => qs.stringify(object)
    , urlencodeWithArrayRepeat = object => qs.stringify(object, {arrayFormat: 'repeat'})
    , rawencode                = object => qs.stringify(object, {encode: false})
    , encode                   = x => x
    , decode                   = x => x

    // Url-safe-base64 without equals signs, with + replaced by - and slashes replaced by underscores

    , urlencodeBase64          = base64string => base64string.replace(/[=]+$/, '').
        replace(/\+/g, '-').
        replace(/\//g, '_')

    , numberToLE               = (n, padding) => {
        const hexArray = new BN(n).toArray('le', padding);
        return byteArrayToWordArray(hexArray);
    }

    , numberToBE               = (n, padding) => {
        const hexArray = new BN(n).toArray('be', padding);
        return byteArrayToWordArray(hexArray);
    }

    , base58ToBuffer           = (s: string): Buffer => { return bs58check.decode(s); }
    , bufferToBase58           = (buf: Buffer): string => { return bs58check.encode(buf); }
    /**
       * Attempts to turn a value into a `Buffer`.
       * Supports Minter prefixed hex strings.
       * Otherwise use `ethereumjs-util.toBuffer`. As input it supports `Buffer`, `String`, `Number`, null/undefined, `BN` and other objects with a `toArray()` method.
       * @param {*} value
       * @return {Buffer}
       */
    , toBuffer                 = (value) => {
        if (typeof value === 'string' && isMinterPrefixed(value)) {
            return mToBuffer(value);
        }

        return ethToBuffer(value);
    }
    /**
       * Converts Minter prefixed hex string to Buffer
       * @param {string} value
       * @return {Buffer}
       */
    , mToBuffer                = (value) => {
        if (typeof value !== 'string') {
            throw new TypeError('Type error: string expected');
        }
        if (!isMinterPrefixed(value)) {
            throw new Error('Not minter prefixed');
        }
        value = mPrefixStrip(value);

        return Buffer.from(value, 'hex');
    };

/*  ------------------------------------------------------------------------ */

export {
    json
    , isJsonEncodedObject
    , stringToBinary
    , stringToBase64
    , base64ToBinary
    , base64ToString
    , binaryToBase64
    , base16ToBinary
    , binaryToBase16
    , binaryConcat
    , binaryConcatArray

    , urlencode
    , urlencodeWithArrayRepeat
    , rawencode
    , encode
    , decode

    // Url-safe-base64 without equals signs, with + replaced by - and slashes replaced by underscores

    , urlencodeBase64
    , numberToLE
    , numberToBE
    , base58ToBuffer
    , bufferToBase58
    , byteArrayToWordArray
    , toBuffer,
};

