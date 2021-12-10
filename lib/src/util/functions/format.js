"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatWithCommas = exports.convertBipToPip = exports.parseBipAmount = exports.convertPipToBip = exports.formatBipAmount = exports.BIP_NOMINATION = exports.BIP_NOMINATION_EXP = void 0;
/**
 * Exponent for calculating how many indivisible units (PIP) are there in one BIP. See {@link BIP_NOMINATION}.
 */
const external_1 = require("../external");
exports.BIP_NOMINATION_EXP = 18;
/**
 * Number of indivisible units in one BIP. Derived from {@link BIP_NOMINATION_EXP}.
 */
exports.BIP_NOMINATION = new external_1.BN('10', 10).pow(new external_1.BN(exports.BIP_NOMINATION_EXP, 10));
// Pre-calculate offests used for rounding to different number of digits
const ROUNDING_OFFSETS = [];
const BN10 = new external_1.BN(10);
for (let i = 0, offset = new external_1.BN(5); i < exports.BIP_NOMINATION_EXP; i++, offset = offset.mul(BN10)) {
    ROUNDING_OFFSETS[i] = offset;
}
/**
 * Convert value from PIP units to BIP. 1 BIP is defined by {@link BIP_NOMINATION}.
 * Effectively this divides given amount by {@link BIP_NOMINATION}.
 *
 * @param pipAmt decimal string representing balance in smallest non-divisible PIP units (as specified by {@link BIP_NOMINATION})
 * @param fracDigits number of fractional digits to preserve in formatted string. Balance is rounded to match given number of digits.
 * @returns Value in human readable BIP units
 */
function formatBipAmount(pipAmt, fracDigits = exports.BIP_NOMINATION_EXP) {
    const amtBN = new external_1.BN(pipAmt, 10);
    if (fracDigits !== exports.BIP_NOMINATION_EXP) {
        // Adjust balance for rounding at given number of digits
        const roundingExp = exports.BIP_NOMINATION_EXP - fracDigits - 1;
        if (roundingExp > 0) {
            amtBN.iadd(ROUNDING_OFFSETS[roundingExp]);
        }
    }
    pipAmt = amtBN.toString();
    const wholeStr = pipAmt.substring(0, pipAmt.length - exports.BIP_NOMINATION_EXP) || '0';
    const fractionStr = pipAmt.substring(pipAmt.length - exports.BIP_NOMINATION_EXP).
        padStart(exports.BIP_NOMINATION_EXP, '0').
        substring(0, fracDigits);
    return trimTrailingZeroes(`${wholeStr}.${fractionStr}`);
}
exports.formatBipAmount = formatBipAmount;
/**
 * Alias to formatBipAmount
 *
 * @param pipAmt
 * @param fracDigits
 */
function convertPipToBip(pipAmt, fracDigits = exports.BIP_NOMINATION_EXP) {
    return formatBipAmount(pipAmt, fracDigits);
}
exports.convertPipToBip = convertPipToBip;
/**
 * Convert human readable BIP amount to PIP units.
 * Effectively this multiplies given amount by {@link BIP_NOMINATION}.
 *
 * @param amt decimal string (potentially fractional) denominated in BIP.
 * @returns The parsed yoctoⓃ {@link https://en.wikipedia.org/wiki/Yocto-} amount or null if no amount was passed in
 */
function parseBipAmount(amt) {
    if (!amt) {
        return null;
    }
    amt = cleanupAmount(amt.toString());
    const split = amt.split('.');
    const wholePart = split[0];
    const fracPart = split[1] || '';
    if (split.length > 2 || fracPart.length > exports.BIP_NOMINATION_EXP) {
        throw new Error(`Cannot parse '${amt}' as BIP amount`);
    }
    return trimLeadingZeroes(wholePart + fracPart.padEnd(exports.BIP_NOMINATION_EXP, '0'));
}
exports.parseBipAmount = parseBipAmount;
/**
 * Alias to parseBipAmount
 *
 * @param amt
 */
function convertBipToPip(amt) {
    return parseBipAmount(amt);
}
exports.convertBipToPip = convertBipToPip;
/**
 * Removes commas from the input
 * @param amount A value or amount that may contain commas
 * @returns string The cleaned value
 */
function cleanupAmount(amount) {
    return amount.replace(/,/g, '').trim();
}
/**
 * Removes .000… from an input
 * @param value A value that may contain trailing zeroes in the decimals place
 * @returns string The value without the trailing zeros
 */
function trimTrailingZeroes(value) {
    return value.replace(/\.?0*$/, '');
}
/**
 * Removes leading zeroes from an input
 * @param value A value that may contain leading zeroes
 * @returns string The value without the leading zeroes
 */
function trimLeadingZeroes(value) {
    value = value.replace(/^0+/, '');
    if (value === '') {
        return '0';
    }
    return value;
}
/**
 * Returns a human-readable value with commas
 * @param value A value that may not contain commas
 * @returns string A value with commas
 */
function formatWithCommas(value) {
    const pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(value)) {
        value = value.replace(pattern, '$1,$2');
    }
    return value;
}
exports.formatWithCommas = formatWithCommas;
