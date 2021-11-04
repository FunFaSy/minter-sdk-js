'use strict';
export const errorHierarchy = {
    'TypedError': {
        'ExchangeError': {
            'AuthenticationError': {
                'PermissionDenied': {},
                'AccountSuspended': {},
            },
        },
        'ActionError'  : {
            'ArgumentsRequired': {},
            'BadRequest'       : {
                'BadSymbol': {},
            },
            'BadResponse'      : {
                'NullResponse': {},
            },
            'InsufficientFunds': {},
            'InvalidAddress'   : {
                'AddressPending': {},
            },
            'InvalidOrder'     : {
                'OrderNotFound'           : {},
                'OrderNotCached'          : {},
                'CancelPending'           : {},
                'OrderImmediatelyFillable': {},
                'OrderNotFillable'        : {},
                'DuplicateOrderId'        : {},
            },
            'InvalidNonce'     : {},
            'NotSupported'     : {},
        },
        'NetworkError' : {
            'DDoSProtection'  : {
                'RateLimitExceeded': {},
            },
            'NodeNotAvailable': {
                'OnMaintenance': {},
            },
            'RequestTimeout'  : {},
        },
    },
};


// export class ArgumentTypeError extends Error {
//     constructor(argName: string, argType: string, argValue: any) {
//         super(`Expected ${argType} for '${argName}' argument, but got '${JSON.stringify(argValue)}'`);
//     }
// }
//

//
// export declare class ExchangeError extends TypedError {}
//
// export declare class NetworkError extends TypedError {}
//
// export declare class DDoSProtection extends NetworkError {}
//
// export declare class InvalidNonce extends NetworkError {}
//
