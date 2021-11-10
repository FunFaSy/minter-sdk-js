/** @hidden @module */
/// <reference types="node" />
import { ethAddress, PrefixedHexString } from './external';
/**
 * A type that represents an Address-like value.
 * To convert to address, use `new Address(toBuffer(value))`
 */
export declare type AddressLike = ethAddress | Buffer | PrefixedHexString;
export declare abstract class Enum {
    enum: string;
    constructor(properties: any);
}
export declare abstract class Assignable {
    constructor(properties: any);
}
