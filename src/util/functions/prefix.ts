import {ethPrivateToAddress} from '../external';
import {toBuffer} from './encode';

export enum Prefix {
    ADDRESS = 'Mx',
    PUB     = 'Mp',
    TX      = 'Mt',
    CHEQUE  = 'Mc',
    HASH    = 'Mh'
}

const PrefixStrings =  Object.keys(Prefix).map(k => Prefix[k as any]);

/**
 * Replace Minter prefixes with hex prefix
 * @param {string} value
 */
export function mPrefixToHex(value) {
    const pattern = new RegExp('^('+PrefixStrings.join('|')+')');
    return value.replace(pattern, '0x');
}

/**
 * Strip Minter prefixes
 * @param {string} value
 */
export function mPrefixStrip(value) {
    const pattern = new RegExp('^('+PrefixStrings.join('|')+')');
    return value.replace(pattern, '');
}


export function addressToString(address) {
    address = toBuffer(address);
    return `${Prefix.ADDRESS}${address.toString('hex')}`;
}

export function checkToString(cheque) {
    cheque = toBuffer(cheque);
    return `${Prefix.CHEQUE}${cheque.toString('hex')}`;
}

/**
 * Returns the Minter style address string of a given private key
 * @param {Buffer} privateKey A private key must be 256 bits wide
 * @return {string}
 */
export function privateToAddressString(privateKey) {
    return `${Prefix.ADDRESS}${ethPrivateToAddress(privateKey).toString('hex')}`;
}

export function isMinterPrefixed(value) {
    const pattern = new RegExp('^('+PrefixStrings.join('|')+')[0-9a-fA-F]+$');
    return pattern.test(value);
}

/**
 * Checks only prefix, length and hex body.
 * Don't check secp256k1 curve.
 * @param {string} publicKey
 * @return {boolean}
 */
export function isValidPublicKeyString(publicKey) {
    const pattern = new RegExp('^'+Prefix.PUB+'[0-9a-fA-F]{64}$');
    return pattern.test(publicKey);
}

export function isValidAddress(address) {
    const pattern = new RegExp('^'+Prefix.ADDRESS+'[0-9a-fA-F]{40}$');
    return pattern.test(address);
}

export function isValidCheck(cheque) {
    const pattern = new RegExp('^'+Prefix.CHEQUE+'[0-9a-fA-F]+$');
    return pattern.test(cheque);
}

export function isValidTransaction(tx) {
    const pattern = new RegExp('^'+Prefix.TX+'[0-9a-fA-F]{64}$');
    return pattern.test(tx);
}
