export declare enum MinterPrefix {
    ADDRESS = "Mx",
    PUB = "Mp",
    TX = "Mt",
    CHEQUE = "Mc",
    HASH = "Mh"
}
/**
 * Replace Minter prefixes with hex prefix
 * @param {string} value
 */
export declare function mPrefixToHex(value: any): any;
/**
 * Strip Minter prefixes
 * @param {string} value
 */
export declare function mPrefixStrip(value: any): any;
export declare function addressToString(address: any): string;
export declare function checkToString(cheque: any): string;
/**
 * Returns the Minter style address string of a given private key
 * @param {Buffer} privateKey A private key must be 256 bits wide
 * @return {string}
 */
export declare function privateToAddressString(privateKey: any): string;
export declare function isMinterPrefixed(value: any): boolean;
/**
 * Checks only prefix, length and hex body.
 * Don't check secp256k1 curve.
 * @param {string} publicKey
 * @return {boolean}
 */
export declare function isValidPublicKey(publicKey: any): boolean;
export declare function isValidAddress(address: any): boolean;
export declare function isValidCheck(cheque: any): boolean;
export declare function isValidTransaction(tx: any): boolean;
