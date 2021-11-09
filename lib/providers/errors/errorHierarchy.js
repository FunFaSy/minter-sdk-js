'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHierarchy = void 0;
exports.errorHierarchy = {
    'TypedError': {
        'ExchangeError': {
            'AuthenticationError': {
                'PermissionDenied': {},
                'AccountSuspended': {},
            },
        },
        'ActionError': {
            'ArgumentsRequired': {},
            'BadRequest': {
                'BadSymbol': {},
            },
            'BadActionResponse': {
                'NullResponse': {},
            },
            'InsufficientFunds': {},
            'InvalidAddress': {
                'AddressPending': {},
            },
            'InvalidOrder': {
                'OrderNotFound': {},
                'OrderNotCached': {},
                'CancelPending': {},
                'OrderImmediatelyFillable': {},
                'OrderNotFillable': {},
                'DuplicateOrderId': {},
            },
            'InvalidNonce': {},
            'NotSupported': {},
        },
        'QueryError': {
            'BadQueryResponse': {},
        },
        'NetworkError': {
            'BadResponse': {},
            'DDoSProtection': {
                'RateLimitExceeded': {},
            },
            'NodeNotAvailable': {
                'OnMaintenance': {},
            },
            'RequestTimeout': {},
        },
    },
};
