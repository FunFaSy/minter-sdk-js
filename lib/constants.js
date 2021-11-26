"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MINTER_LAST_BLOCK_HEIGHT = exports.MINTER_DERIVATION_PATH = void 0;
/**
 *
 44' means BIP44
 60' means Eth 491' [means Minter BIP @see https://github.com/satoshilabs/slips/blob/ef6d7700cc/slip-0044.md]
 0' means wallet/account #0
 0 means ?
 0 means index 0
 */
exports.MINTER_DERIVATION_PATH = 'm/44\'/60\'/0\'/0'; // '/0' - rest number will add Account Generator
exports.MINTER_LAST_BLOCK_HEIGHT = 999999999;
