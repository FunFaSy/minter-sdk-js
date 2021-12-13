import Transport from './transport';
import JsonSerializer from './json-serializer';
import {deepExtend, isNumber, isValidUrl, logWarning, TypedError} from '../util';
import Serializer from './serializer';
import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios';
import createError from 'http-errors';
import axiosRetry from 'axios-retry';
import * as qs from 'qs';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TransportConfig {}

export interface HttpTransportConfig extends TransportConfig, AxiosRequestConfig {
    baseURL?: string;
    url?: string;
    auth?: {
        username: string;
        password: string;
    };
    timeout?: number;
    headers?: Record<string, string>;
}

/**
 *
 */
export default class HttpTransport extends Transport {
    protected readonly axios: AxiosInstance;
    protected maxRetry = 2;

    constructor(protected readonly config?: HttpTransportConfig, serializer?: Serializer) {
      super(serializer || new JsonSerializer());

      this.axios = this.newClient(this.config);
    }

    /**
     * This method will be used to send a Message to the server, using the serializer, via the underlying protocol.
     * @param data - The message to send to the server.
     * @returns - A Promise that will resolve when the message has been sent.
     * @async
     */
    public async send(data: any): Promise<AxiosResponse> {
      return this.axios(data);
    }

    public defaultConfig(): HttpTransportConfig {
      return {
        headers         : {
          'Content-Type': 'application/json; charset=utf-8',
        },
        paramsSerializer: (params) => qs.stringify(params, {arrayFormat: 'repeat'}),
        validateStatus  : function(status) {
          return true; //status >= 200 && status < 300; // default
        },
      } as HttpTransportConfig;
    }

    protected newClient(config: HttpTransportConfig): AxiosInstance {
      config = deepExtend(this.defaultConfig(), config);

      const axiosClient = axios.create(config);

      axiosClient.interceptors.request.use((config): AxiosRequestConfig => {

        if (config?.baseURL) {
          if (!isValidUrl(config.baseURL)) {
            const err = new Error(`Invalid baseUrl ${config.baseURL}`);
            logWarning(err.message);
            throw err;
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
            const data = this.serializer.deserialize(response.data);

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
            return Promise.reject(
              Object.assign(error, new TypedError('Connection was aborted', 'ConnAborted')));
          }

          if (error.response) {
            /*
                         * The request was made and the server responded with a
                         * status code that falls out of the range of 2xx
                         */
            return Promise.reject(
              Object.assign(error, createError(error.response.status, error.response.data)));

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

        if (retryCount && isNumber(retryCount) && this.maxRetry <= retryCount) {
          throw new TypedError(`Exceeded ${this.maxRetry} attempts for ${config.url}.`, 'RetriesExceeded');
        }

        return Promise.reject(error);
      },
      );

      axiosRetry(axiosClient, {
        retries       : this.maxRetry,
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
}
