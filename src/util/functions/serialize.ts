import {toBuffer} from './encode';
import {bs58check, BufferLike} from '../external';

export const baseEncode = (value: BufferLike | string): string => {
    if (typeof (value) === 'string') {
        value = Buffer.from(value, 'utf-8');
    }
    return bs58check.encode(value);
};

export const baseDecode = (value: string): Buffer => {
    return toBuffer(bs58check.decode(value));
};

export {
    baseDecode as base_decode
    , baseEncode as base_encode,
};
