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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const transport_1 = __importDefault(require("./transport"));
const json_serializer_1 = __importDefault(require("./json-serializer"));
const util_1 = require("../util");
const axios_1 = __importDefault(require("axios"));
const http_errors_1 = __importDefault(require("http-errors"));
const axios_retry_1 = __importDefault(require("axios-retry"));
const qs = __importStar(require("qs"));
/**
 *
 */
class HttpTransport extends transport_1.default {
    constructor(config, serializer) {
        super(serializer || new json_serializer_1.default());
        this.config = config;
        this.maxRetry = 2;
        this.axios = this.newClient(this.config);
    }
    /**
     * This method will be used to send a Message to the server, using the serializer, via the underlying protocol.
     * @param data - The message to send to the server.
     * @returns - A Promise that will resolve when the message has been sent.
     * @async
     */
    async send(data) {
        return this.axios(data);
    }
    defaultConfig() {
        return {
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            },
            paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
            validateStatus: function (status) {
                return true; //status >= 200 && status < 300; // default
            },
        };
    }
    newClient(config) {
        config = util_1.deepExtend(this.defaultConfig(), config);
        const axiosClient = axios_1.default.create(config);
        axiosClient.interceptors.request.use((config) => {
            if (config?.baseURL) {
                if (!util_1.isValidUrl(config.baseURL)) {
                    const err = new Error(`Invalid baseUrl ${config.baseURL}`);
                    util_1.logWarning(err.message);
                    throw err;
                }
                if (config.baseURL[config.baseURL.length - 1] !== '/') {
                    config.baseURL += '/';
                }
            }
            return config;
        });
        axiosClient.interceptors.response.use((response) => {
            if (response?.data) {
                // transformResponse
                const data = this.serializer.deserialize(response.data);
                if (data?.error?.details) {
                    data.error.data = data.error.details;
                }
                response.data = data;
            }
            return response;
        }, (error) => {
            const { config } = error;
            // Error 😨
            if (axios_1.default.isCancel(error)) {
                return Promise.reject(Object.assign(error, new util_1.TypedError(error.message, 'RequestCanceled')));
            }
            if ('ECONNRESET' === error.code) {
                util_1.logWarning(`HTTP request for ${config.url} got connection reset`);
                return Promise.reject(Object.assign(error, new util_1.TypedError('Connection was reset', 'ConnReset')));
            }
            if ('ECONNABORTED' === error.code) {
                util_1.logWarning(`HTTP request for ${config.url} got aborted connection`);
                return Promise.reject(Object.assign(error, new util_1.TypedError('Connection was aborted', 'ConnAborted')));
            }
            if (error.response) {
                /*
                             * The request was made and the server responded with a
                             * status code that falls out of the range of 2xx
                             */
                return Promise.reject(Object.assign(error, http_errors_1.default(error.response.status, error.response.data)));
            }
            //
            else if (error.request) {
                /*
                             * The request was made but no response was received, `error.request`
                             * is an instance of XMLHttpRequest in the browser and an instance
                             * of http.ClientRequest in Node.js
                             */
                util_1.logWarning(`HTTP request for ${config.url} got no response` /*, error.request*/);
                return Promise.reject(Object.assign(error, new util_1.TypedError('Server not responding', 'ServerNotResponding')));
            }
            //
            else {
                // Something happened in setting up the request and triggered an Error
                util_1.logWarning(`Something happened in setting up the request ${config.url} and triggered an Error`, error.request);
                return Promise.reject(Object.assign(error, http_errors_1.default(error.status, error.message)));
            }
        });
        axiosClient.interceptors.response.use((response) => {
            return response;
        }, async (error) => {
            const { config } = error;
            const retryCount = 'axios-retry' in config ? config['axios-retry'].retryCount : undefined;
            if (retryCount && util_1.isNumber(retryCount) && this.maxRetry <= retryCount) {
                throw new util_1.TypedError(`Exceeded ${this.maxRetry} attempts for ${config.url}.`, 'RetriesExceeded');
            }
            return Promise.reject(error);
        });
        axios_retry_1.default(axiosClient, {
            retries: this.maxRetry,
            retryDelay: axios_retry_1.default.exponentialDelay,
            retryCondition: async (error) => {
                const retryableErrorTypes = ['ConnAborted', 'ServerNotResponding'];
                if (typeof error['type'] !== 'undefined' && error['type'].length) {
                    return (error?.response?.status != 404 && retryableErrorTypes.includes(error['type']));
                }
                return !error.response || error.response.status >= 500 && error.response.status <= 599;
            },
        });
        return axiosClient;
    }
}
exports.default = HttpTransport;
