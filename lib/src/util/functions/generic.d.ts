declare const keys: {
    (o: object): string[];
    (o: {}): string[];
}, values: (x: any) => any[], index: (x: any) => Set<any>, extend: (...args: any[]) => any, clone: (x: any) => any, unique: (x: any) => any[], arrayConcat: (a: any, b: any) => any, inArray: (needle: any, haystack: any) => any, toArray: (object: any) => unknown[], isEmpty: (object: any) => boolean, keysort: (x: any, out?: {}) => {}, indexBy: (x: any, k: any, out?: {}) => {}, groupBy: (x: any, k: any, out?: {}) => {}, filterBy: (x: any, k: any, value?: any, out?: any[]) => any[], sortBy: (array: any, key: any, descending?: boolean, direction?: number) => any, flatten: (x: any, out?: any[]) => any[], pluck: (x: any, k: any) => any[], omit: (x: any, ...args: any[]) => any, sum: (...xs: any[]) => any, deepExtend: (...xs: any[]) => any;
export { keys, values, extend, clone, index, unique, arrayConcat, inArray, toArray, isEmpty, keysort, indexBy, groupBy, filterBy, sortBy, flatten, pluck, omit, sum, deepExtend, };
