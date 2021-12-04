import {assert, isValidMnemonic} from '../external';
import {isArray, isBuffer, isHexString, isInteger, isNumber, isString} from './type';
import {isValidAddress, isValidPublicKey, isValidTransaction} from './prefix';

const assertIsBuffer = (input: any, msg?: string | Error) => assert(isBuffer(input),
    msg || `Only supports Buffer but input was: ${input}`);
const assertIsString = (input: any, msg?: string | Error) => assert(isString(input),
    msg || `Only supports strings but input was: ${input}`);
const assertIsArray = (input: any, msg?: string | Error) => assert(isArray(input),
    msg || `Only supports number arrays but input was: ${input}`);
const assertIsNumber = (input: any, msg?: string | Error) => assert(isNumber(input),
    msg || `Only supports number but input was: ${input}`);
const assertIsInt = (input: any, msg?: string | Error) => assert(isInteger(input),
    msg || `Only supports integer number but input was: ${input}`);
const assertIsPositiveInt = (input: any, msg?: string | Error) => assert(isInteger(input) && 0 <= input,
    msg || `Only supports positive integer number but input was: ${input}`);
const assertIsHexString = (input: string, msg?: string | Error) => assert(isHexString(input),
    msg || `Only supports 0x-prefixed hex strings but input was: ${input}`);
const assertIsMinerAddress = (input: string, msg?: string | Error) => assert(isValidAddress(input),
    msg || `Only supports Mx-prefixed hex strings but input was: ${input}`);
const assertIsMinerPublicKey = (input: string, msg?: string | Error) => assert(isValidPublicKey(input),
    msg || `Only supports Mp-prefixed hex strings but input was: ${input}`);
const assertIsMinerTransaction = (input: string, msg?: string | Error) => assert(isValidTransaction(input),
    msg || `Only supports Mt-prefixed hex strings but input was: ${input}`);
const assertIsMnemonic = (input: string, msg?: string | Error) => assert(isValidMnemonic(input),
    msg || `Invalid bip39 mnemonic. Expect 12+ dictionary valid words but input was: ${input}`);

export {
    assertIsBuffer
    , assertIsString
    , assertIsNumber
    , assertIsInt
    , assertIsPositiveInt
    , assertIsArray
    , assertIsHexString
    , assertIsMinerAddress
    , assertIsMinerPublicKey
    , assertIsMinerTransaction
    , assertIsMnemonic,
};
