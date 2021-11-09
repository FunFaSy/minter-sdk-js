'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
exports.Address = void 0;
const external_1 = require('./util/external');
const util_1 = require('./util');
const ethereumjs_util_1 = require('ethereumjs-util');

class Address {
    constructor(buf) {
        external_1.assert(buf.length === 20, 'Invalid address length');
        this.buf = buf;
    }

    /**
     * Returns the zero address.
     */
    static zero() {
        return new Address(external_1.zeros(20));
    }

    /**
     * Returns an Address object from a hex-encoded string.
     * @param str - Hex-encoded address
     */
    static fromString(str) {
        external_1.assert(util_1.isValidAddress(str), 'Invalid address');
        return new Address(util_1.toBuffer(str));
    }

    /**
     * Returns an address for a given public key.
     * @param pubKey The two points of an uncompressed key
     */
    static fromPublicKey(pubKey) {
        external_1.assert(Buffer.isBuffer(pubKey),
            'Public key should be Buffer');
        const buf = ethereumjs_util_1.pubToAddress(pubKey);
        return new Address(buf);
    }

    /**
     * Returns an address for a given private key.
     * @param privateKey A private key must be 256 bits wide
     */
    static fromPrivateKey(privateKey) {
        external_1.assert(Buffer.isBuffer(privateKey),
            'Private key should be Buffer');
        const buf = ethereumjs_util_1.privateToAddress(privateKey);
        return new Address(buf);
    }

    /**
     * Generates an address for a newly created contract.
     * @param from The address which is creating this new address
     * @param nonce The nonce of the from account
     */
    static generate(from, nonce) {
        external_1.assert(external_1.BN.isBN(nonce));
        return new Address(ethereumjs_util_1.generateAddress(from.buf,
            nonce.toArrayLike(Buffer)));
    }

    /**
     * Generates an address for a contract created using CREATE2.
     * @param from The address which is creating this new address
     * @param salt A salt
     * @param initCode The init code of the contract being created
     */
    static generate2(from, salt, initCode) {
        external_1.assert(Buffer.isBuffer(salt));
        external_1.assert(Buffer.isBuffer(initCode));
        return new Address(
            ethereumjs_util_1.generateAddress2(from.buf, salt, initCode));
    }

    /**
     * Is address equal to another.
     */
    equals(address) {
        return this.buf.equals(address.buf);
    }

    /**
     * Is address zero.
     */
    isZero() {
        return this.equals(Address.zero());
    }

    /**
     * True if address is in the address range defined
     * by EIP-1352
     */
    isPrecompileOrSystemAddress() {
        const addressBN = new external_1.BN(this.buf);
        const rangeMin = new external_1.BN(0);
        const rangeMax = new external_1.BN('ffff', 'hex');
        return addressBN.gte(rangeMin) && addressBN.lte(rangeMax);
    }

    /**
     * Returns hex encoding of address.
     */
    toString() {
        return 'Mx' + this.buf.toString('hex');
    }

    /**
     * Returns Buffer representation of address.
     */
    toBuffer() {
        return Buffer.from(this.buf);
    }
}

exports.Address = Address;
