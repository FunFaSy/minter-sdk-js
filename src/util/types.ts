/** @hidden @module */
import {PrefixedHexString} from 'ethereumjs-util/src/types';

import {Buffer} from 'buffer';
import {Address} from 'ethereumjs-util/src/address';

/**
 * A type that represents an Address-like value.
 * To convert to address, use `new Address(toBuffer(value))`
 */
export type AddressLike = Address | Buffer | PrefixedHexString

/**
 * A hex string prefixed with `Mx|Mp|Mt|Mc|Mh` Minter prefix.
 */
export type PrefixedMHexString = string

export abstract class Enum {
    enum: string;

    constructor(properties: any) {
        if (Object.keys(properties).length !== 1) {
            throw new Error('Enum can only take single value');
        }
        Object.keys(properties).map((key: string) => {
            (this as any)[key] = properties[key];
            this.enum = key;
        });
    }
}

export abstract class Assignable {
    constructor(properties: any) {
        Object.keys(properties).map((key: any) => {
            (this as any)[key] = properties[key];
        });
    }
}
