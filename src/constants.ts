/**
 *
 44' means BIP44
 60' means Eth 491' [means Minter BIP @see https://github.com/satoshilabs/slips/blob/ef6d7700cc/slip-0044.md]
 0' means wallet/account #0
 0 means ?
 0 means index 0
 */
export const MINTER_DERIVATION_PATH = 'm/44\'/60\'/0\'/0';// '/0' - rest number will add Account Generator

export const MINTER_LAST_BLOCK_HEIGHT = 999999999;
