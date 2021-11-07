import createError from 'http-errors';
import axios, {AxiosRequestConfig, AxiosResponse} from 'axios';
import exponentialBackoff from './exponential-backoff';
import {deepExtend, isString, logWarning, TypedError} from '.';

const START_WAIT_TIME_MS = 500;
const BACKOFF_MULTIPLIER = 1.5;
const RETRY_NUMBER = 3;

export interface ConnectionInfo extends AxiosRequestConfig {
    url: string;
    auth?: {
        username: string;
        password: string;
    };
    timeout?: number;
    headers?: Record<string, string>;
}

const defaultFetcherConfig = {
    headers: {'Content-Type': 'application/json; charset=utf-8'},
} as AxiosRequestConfig;


const parseData = (data) => {
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

/**
 *
 * @param connection
 * @param json
 */
export async function fetchJson(connection: string | ConnectionInfo, json?: string): Promise<any> {
    let config = {
        method: json ? 'POST' : 'GET',
        data  : json ? json : undefined,
    } as AxiosRequestConfig;

    if (isString(connection)) {
        config.url = connection.toString();
    }
    //
    else {
        config = deepExtend(config, connection);
    }

    config = deepExtend(defaultFetcherConfig, config);

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
    },
    );

    const responseData = await exponentialBackoff(START_WAIT_TIME_MS, RETRY_NUMBER, BACKOFF_MULTIPLIER, async () => {
        return await axiosClient(config)
            //
            .then((response: AxiosResponse) => {
                // Success 🎉
                if (response.status === 503) {
                    logWarning(`Retrying HTTP request for ${config.url} as it's not available now`);
                    return null;
                }

                return response.data;
            })
            //
            .catch(error => {
                // Error 😨
                if ('ECONNRESET' === error.code) {
                    logWarning(`Retrying HTTP request for ${config.url} because of connection was reset`);
                    return null;
                }

                if ('ECONNABORTED' === error.code) {
                    logWarning(`Retrying HTTP request for ${config.url} because of connection was aborted`);
                    return null;
                }

                if (error.response) {
                    /*
                     * The request was made and the server responded with a
                     * status code that falls out of the range of 2xx
                     */
                    throw createError(error.response.status, error.response.data);

                } else if (error.request) {
                    /*
                     * The request was made but no response was received, `error.request`
                     * is an instance of XMLHttpRequest in the browser and an instance
                     * of http.ClientRequest in Node.js
                     */
                    logWarning(`Retrying HTTP request for ${config.url} because got no response`, error.request);
                    return null;
                } else {
                    // Something happened in setting up the request and triggered an Error
                    logWarning(`Something happened in setting up the request ${config.url} and triggered an Error`,
                        error.request);
                    throw createError(error.status, error.message);
                }
            });
    });

    if (!responseData) {
        throw new TypedError(`Exceeded ${RETRY_NUMBER} attempts for ${config.url}.`, 'RetriesExceeded');
    }

    return parseData(responseData);
}
