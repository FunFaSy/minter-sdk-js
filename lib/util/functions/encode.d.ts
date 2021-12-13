/// <reference types="node" />
declare const json: (data: any) => string, isJsonEncodedObject: (object: any) => boolean, binaryConcat: (...args: any[]) => any, binaryConcatArray: (arr: any) => any, urlencodeBase64: (base64string: any) => any, base58ToBuffer: (s: string) => Buffer, bufferToBase58: (buf: Buffer) => string
/**
     * Attempts to turn a value into a `Buffer`.
     * Supports Minter prefixed hex strings.
     * Otherwise use `ethereumjs-util.toBuffer`. As input it supports `Buffer`, `String`, `Number`,
     * null/undefined, `BN` and other objects with a `toArray() `toBuffer()` methods.
     * @param {*} v
     * @return {Buffer}
     */
, toBuffer: (v: any) => Buffer
/**
     * Converts Minter prefixed hex string to Buffer
     * @param {string} value
     * @return {Buffer}
     */
;
export { json, isJsonEncodedObject, binaryConcat, binaryConcatArray, urlencodeBase64, base58ToBuffer, bufferToBase58, toBuffer, };
