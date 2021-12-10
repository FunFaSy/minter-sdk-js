"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidTransaction = exports.isValidCheck = exports.isValidAddress = exports.isValidPublicKey = exports.isMinterPrefixed = exports.privateToAddressString = exports.checkToString = exports.addressToString = exports.mPrefixStrip = exports.mPrefixToHex = exports.MinterPrefix = void 0;
const external_1 = require("../external");
const encode_1 = require("./encode");
var MinterPrefix;
(function (MinterPrefix) {
    MinterPrefix["ADDRESS"] = "Mx";
    MinterPrefix["PUB"] = "Mp";
    MinterPrefix["TX"] = "Mt";
    MinterPrefix["CHEQUE"] = "Mc";
    MinterPrefix["HASH"] = "Mh";
})(MinterPrefix = exports.MinterPrefix || (exports.MinterPrefix = {}));
const PrefixStrings = Object.keys(MinterPrefix).map(k => MinterPrefix[k]);
/**
 * Replace Minter prefixes with hex prefix
 * @param {string} value
 */
function mPrefixToHex(value) {
    const pattern = new RegExp('^(' + PrefixStrings.join('|') + ')');
    return value.replace(pattern, '0x');
}
exports.mPrefixToHex = mPrefixToHex;
/**
 * Strip Minter prefixes
 * @param {string} value
 */
function mPrefixStrip(value) {
    const pattern = new RegExp('^(' + PrefixStrings.join('|') + ')');
    return value.replace(pattern, '');
}
exports.mPrefixStrip = mPrefixStrip;
function addressToString(address) {
    address = encode_1.toBuffer(address);
    return `${MinterPrefix.ADDRESS}${address.toString('hex')}`;
}
exports.addressToString = addressToString;
function checkToString(cheque) {
    cheque = encode_1.toBuffer(cheque);
    return `${MinterPrefix.CHEQUE}${cheque.toString('hex')}`;
}
exports.checkToString = checkToString;
/**
 * Returns the Minter style address string of a given private key
 * @param {Buffer} privateKey A private key must be 256 bits wide
 * @return {string}
 */
function privateToAddressString(privateKey) {
    return `${MinterPrefix.ADDRESS}${external_1.ethPrivateToAddress(privateKey).toString('hex')}`;
}
exports.privateToAddressString = privateToAddressString;
function isMinterPrefixed(value) {
    const pattern = new RegExp('^(' + PrefixStrings.join('|') + ')[0-9a-fA-F]+$');
    return pattern.test(value);
}
exports.isMinterPrefixed = isMinterPrefixed;
/**
 * Checks only prefix, length and hex body.
 * Don't check secp256k1 curve.
 * @param {string} publicKey
 * @return {boolean}
 */
function isValidPublicKey(publicKey) {
    const pattern = new RegExp('^' + MinterPrefix.PUB + '[0-9a-fA-F]{64}$');
    return pattern.test(publicKey);
}
exports.isValidPublicKey = isValidPublicKey;
function isValidAddress(address) {
    const pattern = new RegExp('^' + MinterPrefix.ADDRESS + '[0-9a-fA-F]{40}$');
    return pattern.test(address);
}
exports.isValidAddress = isValidAddress;
function isValidCheck(cheque) {
    const pattern = new RegExp('^' + MinterPrefix.CHEQUE + '[0-9a-fA-F]+$');
    return pattern.test(cheque);
}
exports.isValidCheck = isValidCheck;
function isValidTransaction(tx) {
    const pattern = new RegExp('^' + MinterPrefix.TX + '[0-9a-fA-F]{64}$');
    return pattern.test(tx);
}
exports.isValidTransaction = isValidTransaction;
