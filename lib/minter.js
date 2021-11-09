'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
exports.Minter = void 0;
/**
 * This module contains the main class developers will use to interact with Minter.
 * The {@link Minter} class is used to interact with {@link Account | Accounts} through the {@link JsonRpcProvider.JsonRpcProvider | JsonRpcProvider}.
 * It is configured via the {@link MinterConfig}.
 *
 * @example {@link https://#}
 *
 * @module minter
 */
const util_1 = require('./util');

/**
 * This is the main class developers should use to interact with Minter.
 * @example
 * ```js
 * const minter = new Minter(config);
 * ```
 */
class Minter {
    //readonly connection: Connection;
    constructor(config) {
        this.config = util_1.deepExtend({}, config);
        // this.connection = Connection.fromConfig({
        //     networkId: config.networkId,
        //     provider: { type: 'JsonRpcProvider', args: { url: config.nodeUrl } },
        //     signer: config.signer || { type: 'InMemorySigner', keyStore: config.keyStore || config.deps.keyStore }
        // });
    }
}

exports.Minter = Minter;
