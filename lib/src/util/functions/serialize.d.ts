/// <reference types="node" />
import { BufferLike } from '../external';
export declare const baseEncode: (value: BufferLike | string) => string;
export declare const baseDecode: (value: string) => Buffer;
export { baseDecode as base_decode, baseEncode as base_encode, };
