"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchJson = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const axios_1 = __importDefault(require("axios"));
const exponential_backoff_1 = __importDefault(require("./exponential-backoff"));
const _1 = require(".");
const START_WAIT_TIME_MS = 500;
const BACKOFF_MULTIPLIER = 1.5;
const RETRY_NUMBER = 3;
const defaultFetcherConfig = {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
};
const parseData = (data) => {
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
/**
 *
 * @param connection
 * @param json
 */
async function fetchJson(connection, json) {
    let config = {
        method: json ? 'POST' : 'GET',
        data: json ? json : undefined,
    };
    if (_1.isString(connection)) {
        config.url = connection.toString();
    }
    //
    else {
        config = _1.deepExtend(config, connection);
    }
    config = _1.deepExtend(defaultFetcherConfig, config);
    const axiosClient = axios_1.default.create(config);
    axiosClient.interceptors.request.use((config) => {
        if (config?.baseURL) {
            if (!isValidUrl(config.baseURL)) {
                _1.logWarning(`Invalid baseUrl ${config.baseURL}`);
            }
            if (config.baseURL[config.baseURL.length - 1] !== '/') {
                config.baseURL += '/';
            }
        }
        return config;
    });
    const responseData = await exponential_backoff_1.default(START_WAIT_TIME_MS, RETRY_NUMBER, BACKOFF_MULTIPLIER, async () => {
        return await axiosClient(config)
            //
            .then((response) => {
            // Success 🎉
            if (response.status === 503) {
                _1.logWarning(`Retrying HTTP request for ${config.url} as it's not available now`);
                return null;
            }
            return response.data;
        })
            //
            .catch(error => {
            // Error 😨
            if ('ECONNRESET' === error.code) {
                _1.logWarning(`Retrying HTTP request for ${config.url} because of connection was reset`);
                return null;
            }
            if ('ECONNABORTED' === error.code) {
                _1.logWarning(`Retrying HTTP request for ${config.url} because of connection was aborted`);
                return null;
            }
            if (error.response) {
                /*
                 * The request was made and the server responded with a
                 * status code that falls out of the range of 2xx
                 */
                throw http_errors_1.default(error.response.status, error.response.data);
            }
            else if (error.request) {
                /*
                 * The request was made but no response was received, `error.request`
                 * is an instance of XMLHttpRequest in the browser and an instance
                 * of http.ClientRequest in Node.js
                 */
                _1.logWarning(`Retrying HTTP request for ${config.url} because got no response`, error.request);
                return null;
            }
            else {
                // Something happened in setting up the request and triggered an Error
                _1.logWarning(`Something happened in setting up the request ${config.url} and triggered an Error`, error.request);
                throw http_errors_1.default(error.status, error.message);
            }
        });
    });
    if (!responseData) {
        throw new _1.TypedError(`Exceeded ${RETRY_NUMBER} attempts for ${config.url}.`, 'RetriesExceeded');
    }
    return parseData(responseData);
}
exports.fetchJson = fetchJson;
