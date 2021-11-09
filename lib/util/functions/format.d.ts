/// <reference types="bn.js" />
/**
 * Exponent for calculating how many indivisible units (PIP) are there in one BIP. See {@link BIP_NOMINATION}.
 */
import { BN } from '../external';
export declare const BIP_NOMINATION_EXP = 18;
/**
 * Number of indivisible units in one BIP. Derived from {@link BIP_NOMINATION_EXP}.
 */
export declare const BIP_NOMINATION: BN;
/**
 * Convert value from PIP units to BIP. 1 BIP is defined by {@link BIP_NOMINATION}.
 * Effectively this divides given amount by {@link BIP_NOMINATION}.
 *
 * @param pipAmt decimal string representing balance in smallest non-divisible PIP units (as specified by {@link BIP_NOMINATION})
 * @param fracDigits number of fractional digits to preserve in formatted string. Balance is rounded to match given number of digits.
 * @returns Value in human readable BIP units
 */
export declare function formatBipAmount(pipAmt: string | BN, fracDigits?: number): string;
/**
 * Alias to formatBipAmount
 *
 * @param pipAmt
 * @param fracDigits
 */
export declare function convertPipToBip(pipAmt: string | BN, fracDigits?: number): string;
/**
 * Convert human readable BIP amount to PIP units.
 * Effectively this multiplies given amount by {@link BIP_NOMINATION}.
 *
 * @param amt decimal string (potentially fractional) denominated in BIP.
 * @returns The parsed yoctoⓃ {@link https://en.wikipedia.org/wiki/Yocto-} amount or null if no amount was passed in
 */
export declare function parseBipAmount(amt?: string | number): string | null;
/**
 * Alias to parseBipAmount
 *
 * @param amt
 */
export declare function convertBipToPip(amt?: string | number): string | null;
/**
 * Returns a human-readable value with commas
 * @param value A value that may not contain commas
 * @returns string A value with commas
 */
export declare function formatWithCommas(value: string): string;
