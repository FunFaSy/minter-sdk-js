import {Assignable} from './types';

export class TypedError extends Error {
    type: string;
    context?: ErrorContext;

    constructor(message?: string, type?: string, context?: ErrorContext) {
      super(message);
      this.type = type || 'UntypedError';
      this.context = context;
    }
}

export class ErrorContext extends Assignable {}
