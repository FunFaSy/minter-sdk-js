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
exports.newRpcClient = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const axios_1 = __importDefault(require("axios"));
const axios_retry_1 = __importDefault(require("axios-retry"));
const qs = __importStar(require("qs"));
const _1 = require(".");
const RETRY_NUMBER = 2;
const defaultAxiosConfig = {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
    validateStatus: function (status) {
        return true; //status >= 200 && status < 300; // default
    },
};
const parseJsonData = (data) => {
    if (_1.isString(data)) {
        try {
            data = JSON.parse(data);
        }
        catch (e) {
            throw new _1.TypedError(`Invalid json data format. ${e}`, 'BadResponse', data);
        }
    }
    return data;
};
const isValidUrl = (url) => {
    try {
        new URL(url);
    }
    catch (e) {
        return false;
    }
    return true;
};
function newRpcClient(config) {
    config = _1.deepExtend(defaultAxiosConfig, config);
    const axiosClient = axios_1.default.create(config);
    axiosClient.interceptors.request.use((config) => {
        if (config?.baseURL) {
            if (!isValidUrl(config.baseURL)) {
                const err = new Error(`Invalid baseUrl ${config.baseURL}`);
                _1.logWarning(err.message);
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
            const data = parseJsonData(response.data);
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
            return Promise.reject(Object.assign(error, new _1.TypedError(error.message, 'RequestCanceled')));
        }
        if ('ECONNRESET' === error.code) {
            _1.logWarning(`HTTP request for ${config.url} got connection reset`);
            return Promise.reject(Object.assign(error, new _1.TypedError('Connection was reset', 'ConnReset')));
        }
        if ('ECONNABORTED' === error.code) {
            _1.logWarning(`HTTP request for ${config.url} got aborted connection`);
            return Promise.reject(Object.assign(error, new _1.TypedError('Connection was aborted', 'ConnAborted')));
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
            _1.logWarning(`HTTP request for ${config.url} got no response` /*, error.request*/);
            return Promise.reject(Object.assign(error, new _1.TypedError('Server not responding', 'ServerNotResponding')));
        }
        //
        else {
            // Something happened in setting up the request and triggered an Error
            _1.logWarning(`Something happened in setting up the request ${config.url} and triggered an Error`, error.request);
            return Promise.reject(Object.assign(error, http_errors_1.default(error.status, error.message)));
        }
    });
    axiosClient.interceptors.response.use((response) => {
        return response;
    }, async (error) => {
        const { config } = error;
        const retryCount = 'axios-retry' in config ? config['axios-retry'].retryCount : undefined;
        if (retryCount && _1.isNumber(retryCount) && RETRY_NUMBER <= retryCount) {
            throw new _1.TypedError(`Exceeded ${RETRY_NUMBER} attempts for ${config.url}.`, 'RetriesExceeded');
        }
        return Promise.reject(error);
    });
    axios_retry_1.default(axiosClient, {
        retries: RETRY_NUMBER,
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
exports.newRpcClient = newRpcClient;
