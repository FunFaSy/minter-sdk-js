"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonRpcProvider = void 0;
const provider_1 = require("./provider");
const util_1 = require("../util");
const exponential_backoff_1 = __importDefault(require("../util/exponential-backoff"));
const errors_1 = require("./errors");
// Default number of retries before giving up on a request.
const REQUEST_RETRY_NUMBER = 5;
// Default wait until next retry in millis.
const REQUEST_RETRY_WAIT = 500;
// Exponential back off for waiting to retry.
const REQUEST_RETRY_WAIT_BACKOFF = 1.5;
/**
 * Client class to interact with the Minter RPC API.
 * @see {@link https://#}
 */
class JsonRpcProvider extends provider_1.Provider {
    /**
     * @param connection
     */
    constructor(connection) {
        super();
        if (util_1.isString(connection)) {
            this.connection = { url: connection.toString() };
        }
        else {
            this.connection = connection;
        }
    }
    async sendRpcCall(url, data = undefined) {
        const resultData = await exponential_backoff_1.default(REQUEST_RETRY_WAIT, REQUEST_RETRY_NUMBER, REQUEST_RETRY_WAIT_BACKOFF, async () => {
            try {
                const config = util_1.deepExtend({}, this.connection, { url });
                const response = await util_1.fetchJson(config, JSON.stringify(data));
                if (response?.error) {
                    /**
                     * {
                     *  error: {
                     *   code: "400",
                     *   message: "tx (AC030EE03AD15373EACF98C74A7CBFA614DA7E883C5EFC58E9C366926864E9) not found",
                     *   data: { }
                     *  }
                     * }
                     */
                    if (typeof response.error?.data === 'object') {
                        if (typeof response.error?.message === 'string'
                            && typeof response.error.data?.type === 'string') {
                            // if error data has message and type properties, we consider that node returned an
                            // error in the Typed format
                            throw new util_1.TypedError(response.error.message, response.error.data.type);
                        }
                    }
                    throw errors_1.parseRpcError(response.error);
                }
                // Success when response.error is not exist
                return response;
            }
            catch (error) {
                if (error?.type === 'TimeoutError') {
                    util_1.logWarning(`Retrying request to ${url} as it has timed out`, data);
                    return null;
                }
                throw error;
            }
        });
        if (typeof resultData === 'undefined') {
            throw new util_1.TypedError(`Exceeded ${REQUEST_RETRY_NUMBER} attempts for request to ${url}.`, 'RetriesExceeded');
        }
        return resultData;
    }
    status() {
        return this.sendRpcCall('status');
    }
}
exports.JsonRpcProvider = JsonRpcProvider;
