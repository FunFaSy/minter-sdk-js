import createError from 'http-errors';
import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios';
import axiosRetry from 'axios-retry';
import * as qs from 'qs';
import {deepExtend, isNumber, isString, logWarning, TypedError} from '.';

const RETRY_NUMBER = 2;

export interface ConnectionInfo extends AxiosRequestConfig {
    baseURL?: string;
    url: string;
    auth?: {
        username: string;
        password: string;
    };
    timeout?: number;
    headers?: Record<string, string>;
}

const defaultAxiosConfig = {
    headers         : {'Content-Type': 'application/json; charset=utf-8'},
    paramsSerializer: (params) => qs.stringify(params, {arrayFormat: 'repeat'}),
    validateStatus  : function(status) {
        return true; //status >= 200 && status < 300; // default
    },
} as AxiosRequestConfig;

const parseJsonData = (data) => {
    if (isString(data)) {
        try {
            data = JSON.parse(data);
        }
        catch (e) {
            throw new TypedError(`Invalid json data format. ${e}`, 'BadResponse', data);
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

export function newRpcClient(config: AxiosRequestConfig): AxiosInstance {
    config = deepExtend(defaultAxiosConfig, config);
    const axiosClient = axios.create(config);

    axiosClient.interceptors.request.use((config: AxiosRequestConfig): AxiosRequestConfig => {

        if (config?.baseURL) {
            if (!isValidUrl(config.baseURL)) {
                logWarning(`Invalid baseUrl ${config.baseURL}`);
            }

            if (config.baseURL[config.baseURL.length - 1] !== '/') {
                config.baseURL += '/';
            }
        }

        return config;
    });

    axiosClient.interceptors.response.use(
        (response: AxiosResponse) => {
            if (response?.data) {
            // transformResponse
                const data = parseJsonData(response.data);

                if (data?.error?.details) {
                    data.error.data = data.error.details;
                }
                response.data = data;
            }

            return response;
        },
        (error) => {
            const {config} = error;

            // Error 😨
            if (axios.isCancel(error)) {
                return Promise.reject(Object.assign(error, new TypedError(error.message, 'RequestCanceled')));
            }

            if ('ECONNRESET' === error.code) {
                logWarning(`HTTP request for ${config.url} got connection reset`);
                return Promise.reject(Object.assign(error, new TypedError('Connection was reset', 'ConnReset')));
            }

            if ('ECONNABORTED' === error.code) {
                logWarning(`HTTP request for ${config.url} got aborted connection`);
                return Promise.reject(Object.assign(error, new TypedError('Connection was aborted', 'ConnAborted')));
            }

            if (error.response) {
            /*
                 * The request was made and the server responded with a
                 * status code that falls out of the range of 2xx
                 */
                return Promise.reject(Object.assign(error, createError(error.response.status, error.response.data)));

            }
            //
            else if (error.request) {
            /*
                 * The request was made but no response was received, `error.request`
                 * is an instance of XMLHttpRequest in the browser and an instance
                 * of http.ClientRequest in Node.js
                 */
                logWarning(`HTTP request for ${config.url} got no response`/*, error.request*/);
                return Promise.reject(
                    Object.assign(error, new TypedError('Server not responding', 'ServerNotResponding')));
            }
            //
            else {
            // Something happened in setting up the request and triggered an Error
                logWarning(`Something happened in setting up the request ${config.url} and triggered an Error`,
                    error.request);
                return Promise.reject(Object.assign(error, createError(error.status, error.message)));
            }

        },
    );

    axiosClient.interceptors.response.use((response) => {
        return response;
    },
    async (error) => {
        const {config} = error;
        const retryCount = 'axios-retry' in config ? config['axios-retry'].retryCount : undefined;

        if (retryCount && isNumber(retryCount) && RETRY_NUMBER <= retryCount) {
            throw new TypedError(`Exceeded ${RETRY_NUMBER} attempts for ${config.url}.`, 'RetriesExceeded');
        }

        return Promise.reject(error);
    },
    );

    axiosRetry(axiosClient, {
        retries       : RETRY_NUMBER,
        retryDelay    : axiosRetry.exponentialDelay,
        retryCondition: async (error): Promise<boolean> => {
            const retryableErrorTypes = ['ConnAborted', 'ServerNotResponding'];

            if (typeof error['type'] !== 'undefined' && error['type'].length) {
                return (error?.response?.status != 404 && retryableErrorTypes.includes(error['type']));
            }

            return !error.response || error.response.status >= 500 && error.response.status <= 599;
        },
    });

    return axiosClient;
}
