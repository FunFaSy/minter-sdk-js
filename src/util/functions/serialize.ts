import * as  bs58check from 'bs58check';
import {BufferLike} from 'ethereumjs-util/src//types';
import {toBuffer} from 'ethereumjs-util/src/bytes';

export function baseEncode(value: BufferLike | string): string {
    if (typeof (value) === 'string') {
        value = Buffer.from(value, 'utf-8');
    }

    return bs58check.encode(value);
}

export function baseDecode(value: string): Buffer {
    return toBuffer(bs58check.decode(value));
}

export {
    serialize,
    deserialize,
    Schema,
    BorshError,
    BinaryWriter,
    BinaryReader,
} from 'borsh';

export {BufferLike,toBuffer};
