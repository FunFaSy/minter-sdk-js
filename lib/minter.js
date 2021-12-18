"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Minter = void 0;
/**
 * This module contains the main class developers will use to interact with Minter.
 * The {@link Minter} class is used to interact with {@link Account | Accounts} through the {@link JsonRpcProvider}.
 * It is configured via the {@link MinterConfig}.
 *
 * @example {@link https://#}
 *
 * @module minter
 */
const util_1 = require("./util");
const connection_1 = require("./connection");
const chain_1 = require("./chain/chain");
const wallet_1 = require("./wallet");
/**
 * This is the main class developers should use to interact with Minter.
 * @example
 * ```js
 * ```
 */
class Minter {
    constructor(config) {
        this.config = util_1.deepExtend({}, config);
        this.chain = new chain_1.Chain(config.chainId);
        this.connection = connection_1.Connection.fromConfig({
            chainId: this.chain.chainId,
            provider: {
                type: 'JsonRpcProvider',
                args: {
                    config: config.rpcConfig || undefined,
                    url: config.nodeUrl || this.chain.urls?.api?.node?.http[0],
                },
            },
        });
    }
    /**
     *
     */
    get rpc() {
        return this.connection.provider;
    }
    /**
     *
     * @param params
     * @param walletId
     */
    async walletFrom(params, walletId) {
        if (params?.seed?.length) {
            return wallet_1.Wallet.fromSeed(params?.seed, walletId).then(wall => wall.setConnection(this.connection));
        }
        else if (params?.mnemonic?.length) {
            return wallet_1.Wallet.fromMnemonic(params?.mnemonic, walletId).then(wall => wall.setConnection(this.connection));
        }
        return Promise.reject(new Error('Invalid parameters'));
    }
    /**
     *
     */
    async newWallet() {
        const mnemonic = wallet_1.Wallet.generateMnemonic();
        const wall = await this.walletFrom({ mnemonic });
        return { wall, mnemonic };
    }
}
exports.Minter = Minter;
