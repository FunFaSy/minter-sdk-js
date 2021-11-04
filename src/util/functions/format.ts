import BN from 'bn.js';

/**
 * Exponent for calculating how many indivisible units (PIP) are there in one BIP. See {@link BIP_NOMINATION}.
 */
export const BIP_NOMINATION_EXP = 18;

/**
 * Number of indivisible units in one BIP. Derived from {@link BIP_NOMINATION_EXP}.
 */
export const BIP_NOMINATION = new BN('10', 10).pow(new BN(BIP_NOMINATION_EXP, 10));

// Pre-calculate offests used for rounding to different number of digits
const ROUNDING_OFFSETS: BN[] = [];
const BN10 = new BN(10);
for (let i = 0, offset = new BN(5); i < BIP_NOMINATION_EXP; i++, offset = offset.mul(BN10)) {
    ROUNDING_OFFSETS[i] = offset;
}

/**
 * Convert value from PIP units to BIP. 1 BIP is defined by {@link BIP_NOMINATION}.
 * Effectively this divides given amount by {@link BIP_NOMINATION}.
 *
 * @param balance decimal string representing balance in smallest non-divisible PIP units (as specified by {@link BIP_NOMINATION})
 * @param fracDigits number of fractional digits to preserve in formatted string. Balance is rounded to match given number of digits.
 * @returns Value in human readable BIP units
 */
export function formatBipAmount(balance: string, fracDigits: number = BIP_NOMINATION_EXP): string {
    const balanceBN = new BN(balance, 10);
    if (fracDigits !== BIP_NOMINATION_EXP) {
        // Adjust balance for rounding at given number of digits
        const roundingExp = BIP_NOMINATION_EXP - fracDigits - 1;
        if (roundingExp > 0) {
            balanceBN.iadd(ROUNDING_OFFSETS[roundingExp]);
        }
    }

    balance = balanceBN.toString();
    const wholeStr = balance.substring(0, balance.length - BIP_NOMINATION_EXP) || '0';
    const fractionStr = balance.substring(balance.length - BIP_NOMINATION_EXP).
        padStart(BIP_NOMINATION_EXP, '0').
        substring(0, fracDigits);

    return trimTrailingZeroes(`${formatWithCommas(wholeStr)}.${fractionStr}`);
}

/**
 * Alias to formatBipAmount
 *
 * @param amt
 * @param fracDigits
 */
export function convertFromPip(amt: string, fracDigits: number = BIP_NOMINATION_EXP): string {
    return formatBipAmount(amt, fracDigits);
}

/**
 * Convert human readable BIP amount to PIP units.
 * Effectively this multiplies given amount by {@link BIP_NOMINATION}.
 *
 * @param amt decimal string (potentially fractional) denominated in BIP.
 * @returns The parsed yoctoⓃ {@link https://en.wikipedia.org/wiki/Yocto-} amount or null if no amount was passed in
 */
export function parseBipAmount(amt?: string): string | null {
    if (!amt) { return null; }
    amt = cleanupAmount(amt);
    const split = amt.split('.');
    const wholePart = split[0];
    const fracPart = split[1] || '';
    if (split.length > 2 || fracPart.length > BIP_NOMINATION_EXP) {
        throw new Error(`Cannot parse '${amt}' as BIP amount`);
    }
    return trimLeadingZeroes(wholePart + fracPart.padEnd(BIP_NOMINATION_EXP, '0'));
}

/**
 * Alias to parseBipAmount
 *
 * @param amt
 */
export function convertToPip(amt?: string): string | null {
    return parseBipAmount(amt);
}


/**
 * Removes commas from the input
 * @param amount A value or amount that may contain commas
 * @returns string The cleaned value
 */
function cleanupAmount(amount: string): string {
    return amount.replace(/,/g, '').trim();
}

/**
 * Removes .000… from an input
 * @param value A value that may contain trailing zeroes in the decimals place
 * @returns string The value without the trailing zeros
 */
function trimTrailingZeroes(value: string): string {
    return value.replace(/\.?0*$/, '');
}

/**
 * Removes leading zeroes from an input
 * @param value A value that may contain leading zeroes
 * @returns string The value without the leading zeroes
 */
function trimLeadingZeroes(value: string): string {
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
function formatWithCommas(value: string): string {
    const pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(value)) {
        value = value.replace(pattern, '$1,$2');
    }
    return value;
}