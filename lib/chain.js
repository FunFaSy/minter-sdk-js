"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chain = void 0;
const mainNetParams = __importStar(require("./chain/mainnet.json"));
const tacoNetParams = __importStar(require("./chain/taconet.json"));
const testNetParams = __importStar(require("./chain/testnet.json"));
const util_1 = require("./util");
const type_1 = require("./util/functions/type");
__exportStar(require("./chain/types"), exports);
/**
 * Chain class to access chain parameters
 */
class Chain {
    /**
     * @constructor
     * @param chain String ('mainnet') or Number (1) or Dictionary with chain params
     */
    constructor(chain) {
        //
        if (type_1.isString(chain)) {
            this.chainParams = Chain.getBaseParams(chain.toString());
        }
        else if (type_1.isNumber(chain)) {
            this.chainParams = Chain.getBaseParams(Number(chain));
        }
        else if (type_1.isObject(chain)) {
            this.chainParams = chain;
        }
        // const configEntries = Object.entries(this.chainParams);
        // for (let i = 0; i < configEntries.length; i++) {
        //     const [property, value] = configEntries[i];
        //     if (value && Object.getPrototypeOf(value) === Object.prototype) {
        //         this[property] = deepExtend(this[property], value);
        //     } else {
        //         this[property] = value;
        //     }
        // }
    }
    /**
     * Creates a Chain object for a custom chain, based on a standard one. It uses all the [[ChainParams]]
     * params from [[baseChain]] except the ones overridden in [[userConfig]].
     *
     * @param baseChain The name (`mainnet`) or id (`1`) of a standard chain used to base the custom
     * chain params on.
     * @param userConfig The custom parameters of the chain.
     */
    static forCustomChain(baseChain, userConfig) {
        const baseConfig = Chain.getBaseParams(baseChain);
        const config = util_1.deepExtend({}, baseConfig, userConfig);
        return new Chain(config);
    }
    /**
     *  Returns the ChainParams object represents given chain.
     * @param chain
     */
    static getBaseParams(chain) {
        let baseConfig;
        if (type_1.isString(chain)) {
            switch (chain) {
                case 'mainnet':
                    baseConfig = mainNetParams;
                    break;
                case 'testnet':
                    baseConfig = testNetParams;
                    break;
                case 'taconet':
                    baseConfig = tacoNetParams;
                    break;
                default:
                    throw new Error(`Unknown chainId ${chain}`);
            }
        }
        //
        else if (type_1.isNumber(chain)) {
            switch (chain) {
                case mainNetParams.networkId:
                    baseConfig = mainNetParams;
                    break;
                case testNetParams.networkId:
                    baseConfig = testNetParams;
                    break;
                case tacoNetParams.networkId:
                    baseConfig = tacoNetParams;
                    break;
                default:
                    throw new Error(`Unknown networkId ${chain}`);
            }
        }
        return baseConfig;
    }
    /**
     *
     */
    describe() {
        return JSON.parse(JSON.stringify(this));
    }
    /**
     * Returns the Genesis parameters of current chain
     * @returns Genesis dictionary
     */
    genesis() {
        return this.chainParams.genesis;
    }
    /**
     * Returns bootstrap nodes for the current chain
     * @returns {Dictionary} Dict with bootstrap nodes
     */
    bootstrapNodes() {
        return this.chainParams.bootstrapNodes;
    }
    /**
     * Returns the name of current chain
     * @returns chain name (lower case)
     */
    name() {
        return this.chainParams.name.toLowerCase();
    }
    /**
     * Returns the Id of current chain
     * @returns chain Id
     */
    chainId() {
        return this.chainParams.chainId;
    }
    /**
     * Returns the Id of current network
     * @returns network Id
     */
    networkId() {
        return this.chainParams.networkId;
    }
    /**
     * Returns the Id of gasCoin for current network
     * @returns gasCoin Id
     */
    gasCoin() {
        return this.chainParams.gasCoinId;
    }
    /**
     *
     */
    urls() {
        return this.chainParams.urls;
    }
}
exports.Chain = Chain;
