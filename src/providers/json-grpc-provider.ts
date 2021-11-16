// /**
//  * MINTER JSON HTTP RPC API PROVIDER
//  * @module
//  */
// import {Provider} from './provider';
// import {ConnectionInfo, isString, logWarning, newRpcClient, TypedError} from '../util';
// import exponentialBackoff from '../util/exponential-backoff';
// import {parseRpcError} from './errors';
// import * as rpcTypes from './types';
// import {CandidatesStatusEnum} from './types';
// import {AxiosInstance, AxiosRequestConfig} from 'axios';
//
// // Default number of retries before giving up on a request.
// const REQUEST_RETRY_NUMBER = 5;
//
// // Default wait until next retry in millis.
// const REQUEST_RETRY_WAIT = 500;
//
// // Exponential back off for waiting to retry.
// const REQUEST_RETRY_WAIT_BACKOFF = 1.5;
//
// /**
//  * Client class to interact with the Minter RPC API.
//  * @see {@link https://#}
//  */
// export class JsonGRpcProvider extends Provider {
//     /** @hidden */
//     protected readonly connection: ConnectionInfo;
//     protected readonly gRpcClient: AxiosInstance;
//
// }
