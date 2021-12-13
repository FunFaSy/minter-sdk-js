"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MINTER_LAST_BLOCK_HEIGHT = exports.MINTER_BIP44_DERIVATION_COIN_ID = void 0;
/**
 * @see https://read.cash/@ukio/into-the-rabbit-hole-2-overview-of-bip-32-bip-39-bip-43-bip-44-wallet-standards-15a1f5e2
 *
 m  meta prefix [m,M,m',M'] - valid
 44' purpose: is a constant means BIP44
 60' coin_type: defines the type of coin 60 means Eth | 491' means Minter BIP
 @see https://github.com/satoshilabs/slips/blob/ef6d7700cc/slip-0044.md]
 0' account: #0
 0  change/receive: specifies if the address is for receive or change operations
 0  address_index: denotes the index of the address being generated
 */
exports.MINTER_BIP44_DERIVATION_COIN_ID = 60; // 60 ETh / 491 Minter Bip [ till Minter 2.6.x use ETH Id ]
exports.MINTER_LAST_BLOCK_HEIGHT = 999999999;
