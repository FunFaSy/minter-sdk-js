'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHierarchy = void 0;
exports.errorHierarchy = {
    'TypedError': {
        'ExchangeError': {},
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
                'DuplicateOrderId': {},
            },
            'InvalidNonce': {},
            'NotSupported': {},
            'TxAlreadyExists': {},
            'TxNotFound': {},
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
            'UnknownServerError': {},
        },
    },
};
