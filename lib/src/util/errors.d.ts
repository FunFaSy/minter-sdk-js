import { Assignable } from './types';
export declare class TypedError extends Error {
    type: string;
    context?: ErrorContext;
    constructor(message?: string, type?: string, context?: ErrorContext);
}
export declare class ErrorContext extends Assignable {
}
