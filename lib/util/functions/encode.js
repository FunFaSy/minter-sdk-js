'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.toBuffer = exports.bufferToBase58 = exports.base58ToBuffer = exports.urlencodeBase64 = exports.binaryConcatArray = exports.binaryConcat = exports.isJsonEncodedObject = exports.json = void 0;
const external_1 = require("../external");
const prefix_1 = require("./prefix");
/*  ------------------------------------------------------------------------ */
// const byteArrayToWordArray = (ba) => {
//     const wa = [];
//     for (let i = 0; i < ba.length; i++) {
//         wa[(i / 4) | 0] |= ba[i] << (24 - 8 * i);
//     }
//     return CryptoJS.lib.WordArray.create(wa, ba.length);
// };
const json = (data, params = undefined) => JSON.stringify(data), isJsonEncodedObject = object => ((typeof object === 'string') &&
    (object.length >= 2) &&
    ((object[0] === '{') || (object[0] === '[')))
// , stringToBinary           = string => CryptoJS.enc.Latin1.parse(string)
// , stringToBase64           = string => CryptoJS.enc.Latin1.parse(string).toString(CryptoJS.enc.Base64)
// , base64ToBinary           = string => CryptoJS.enc.Base64.parse(string)
// , base64ToString           = string => CryptoJS.enc.Base64.parse(string).toString(CryptoJS.enc.Utf8)
// , binaryToBase64           = binary => binary.toString(CryptoJS.enc.Base64)
// , base16ToBinary           = string => CryptoJS.enc.Hex.parse(string)
// , binaryToBase16           = binary => binary.toString(CryptoJS.enc.Hex)
, binaryConcat = (...args) => args.reduce((a, b) => a.concat(b)), binaryConcatArray = (arr) => arr.reduce((a, b) => a.concat(b))
// , urlencode                = object => qs.stringify(object)
// , urlencodeWithArrayRepeat = object => qs.stringify(object, {arrayFormat: 'repeat'})
// , rawencode                = object => qs.stringify(object, {encode: false})
// Url-safe-base64 without equals signs, with + replaced by - and slashes replaced by underscores
, urlencodeBase64 = base64string => base64string.replace(/[=]+$/, '').
    replace(/\+/g, '-').
    replace(/\//g, '_')
// , numberToLE               = (n, padding) => {
//     const hexArray = new BN(n).toArray('le', padding);
//     return byteArrayToWordArray(hexArray);
// }
// , numberToBE               = (n, padding) => {
//     const hexArray = new BN(n).toArray('be', padding);
//     return byteArrayToWordArray(hexArray);
// }
, base58ToBuffer = (s) => {
    return external_1.bs58check.decode(s);
}, bufferToBase58 = (buf) => {
    return external_1.bs58check.encode(buf);
}
/**
   * Attempts to turn a value into a `Buffer`.
   * Supports Minter prefixed hex strings.
   * Otherwise use `ethereumjs-util.toBuffer`. As input it supports `Buffer`, `String`, `Number`, null/undefined, `BN` and other objects with a `toArray()` method.
   * @param {*} value
   * @return {Buffer}
   */
, toBuffer = (value) => {
    if (typeof value === 'string' && prefix_1.isMinterPrefixed(value)) {
        return mToBuffer(value);
    }
    return external_1.ethToBuffer(value);
}
/**
   * Converts Minter prefixed hex string to Buffer
   * @param {string} value
   * @return {Buffer}
   */
, mToBuffer = (value) => {
    if (typeof value !== 'string') {
        throw new TypeError('Type error: string expected');
    }
    if (!prefix_1.isMinterPrefixed(value)) {
        throw new Error('Not minter prefixed');
    }
    value = prefix_1.mPrefixStrip(value);
    return Buffer.from(value, 'hex');
};
exports.json = json;
exports.isJsonEncodedObject = isJsonEncodedObject;
exports.binaryConcat = binaryConcat;
exports.binaryConcatArray = binaryConcatArray;
exports.urlencodeBase64 = urlencodeBase64;
exports.base58ToBuffer = base58ToBuffer;
exports.bufferToBase58 = bufferToBase58;
exports.toBuffer = toBuffer;
