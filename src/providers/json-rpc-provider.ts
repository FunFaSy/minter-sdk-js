import {Provider} from './provider';
import {ConnectionInfo, deepExtend, fetchJson, isString, logWarning, TypedError} from '../util';
import exponentialBackoff from '../util/exponential-backoff';
import {parseRpcError} from './errors';
import {NodeStatusResult} from './types';

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
export class JsonRpcProvider extends Provider {
    /** @hidden */
    readonly connection: ConnectionInfo;

    /**
     * @param connection
     */
    constructor(connection: string | ConnectionInfo) {
        super();
        if (isString(connection)) {
            this.connection = {url: connection.toString()} as ConnectionInfo;
        } else {
            this.connection = connection as ConnectionInfo;
        }
    }

    async sendRpcCall<T>(url: string, data: object = undefined): Promise<T> {
        const resultData = await exponentialBackoff(REQUEST_RETRY_WAIT, REQUEST_RETRY_NUMBER,
            REQUEST_RETRY_WAIT_BACKOFF,
            async () => {
                try {
                    const config = deepExtend({}, this.connection, {url});
                    const response = await fetchJson(config, JSON.stringify(data));

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
                                throw new TypedError(response.error.message, response.error.data.type);
                            }
                        }

                        throw parseRpcError(response.error);
                    }

                    // Success when response.error is not exist
                    return response;
                }
                catch (error) {
                    if (error?.type === 'TimeoutError') {
                        logWarning(`Retrying request to ${url} as it has timed out`, data);
                        return null;
                    }
                    throw error;
                }
            });

        if (typeof resultData === 'undefined') {
            throw new TypedError(
                `Exceeded ${REQUEST_RETRY_NUMBER} attempts for request to ${url}.`, 'RetriesExceeded');
        }

        return resultData;
    }

    status(): Promise<NodeStatusResult> {
        return this.sendRpcCall('status');
    }
}
