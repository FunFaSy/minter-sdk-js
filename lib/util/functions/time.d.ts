declare const now: () => number;
declare const microseconds: () => number;
declare const milliseconds: () => number;
declare const seconds: () => number;
declare const uuidv1: () => string;
declare const setTimeout_safe: (done: any, ms: any, setTimeoutOrig?: typeof setTimeout, targetTime?: any) => () => void;
declare class TimedOut extends Error {
    constructor();
}
declare const iso8601: (timestamp: any) => string;
declare const parse8601: (x: any) => number;
declare const parseDate: (x: any) => number;
declare const rfc2616: (timestamp?: any) => string;
declare const mdy: (timestamp: any, infix?: string) => string;
declare const ymd: (timestamp: any, infix?: string) => string;
declare const ymdhms: (timestamp: any, infix?: string) => string;
declare const sleep: (ms: any) => Promise<unknown>;
declare const timeout: (ms: any, promise: any) => Promise<any>;
export { now, microseconds, milliseconds, seconds, iso8601, parse8601, rfc2616, uuidv1, parseDate, mdy, ymd, ymdhms, setTimeout_safe, sleep, TimedOut, timeout, };
