'use strict';
export const errorHierarchy = {
  'TypedError': {
    'ExchangeError': {},
    'ActionError'  : {
      'ArgumentsRequired': {},
      'BadRequest'       : {
        'BadSymbol': {},
      },
      'BadActionResponse': {
        'NullResponse': {},
      },
      'InsufficientFunds': {},
      'InvalidAddress'   : {
        'AddressPending': {},
      },
      'InvalidOrder'     : {
        'OrderNotFound'   : {},
        'DuplicateOrderId': {},
      },
      'InvalidNonce'     : {},
      'NotSupported'     : {},
      'TxAlreadyExists'  : {},
      'TxNotFound'       : {},
    },
    'QueryError'   : {
      'BadQueryResponse': {},
    },
    'NetworkError' : {
      'BadResponse'       : {},
      'DDoSProtection'    : {
        'RateLimitExceeded': {},
      },
      'NodeNotAvailable'  : {
        'OnMaintenance': {},
      },
      'RequestTimeout'    : {},
      'UnknownServerError': {},
    },
  },
};

