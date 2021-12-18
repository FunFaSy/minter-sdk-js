"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Connection = void 0;
const providers_1 = require("./providers");
/**
 * @param config Contains connection info details
 * @returns {Provider}
 */
function getProvider(config) {
    switch (config.type) {
        case undefined:
            return undefined;
        case 'JsonRpcProvider':
            return new providers_1.JsonRpcProvider(config.args.providerConfig || config.args.url);
        default:
            throw new Error(`Unknown provider type ${config.type}`);
    }
}
/**
 * Connects an account to a given network via a given provider
 */
class Connection {
    constructor(chainId, provider) {
        this.chainId = chainId;
        this.provider = provider;
    }
    /**
     * @param config Contains connection info details
     */
    static fromConfig(config) {
        const provider = getProvider(config.provider);
        return new Connection(config.chainId, provider);
    }
}
exports.Connection = Connection;
