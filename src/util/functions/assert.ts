import {assert} from '../external';
import {isArray, isBuffer, isHexString, isString} from './type';

const assertIsBuffer = (input: any, msg: string = undefined) => assert(isBuffer(input),msg || `Only supports Buffer but input was: ${input}`);
const assertIsString = (input: any, msg: string = undefined) => assert(isString(input),msg || `Only supports strings but input was: ${input}`);
const assertIsArray = (input: any, msg: string = undefined) => assert(isArray(input),msg || `Only supports number arrays but input was: ${input}`);
const assertIsHexString =  (input: string,msg: string = undefined) => assert(isHexString(input),msg || `Only supports 0x-prefixed hex strings but input was: ${input}`);


export {
    assertIsBuffer
    ,assertIsString
    ,assertIsArray
    ,assertIsHexString
};
