/// <reference types="node" />
import { fArgReturn } from './types';
export interface RlpSchemaField {
    name: string;
    length?: number;
    alias?: string;
    allowLess?: boolean;
    allowZero?: boolean;
    default?: Buffer;
    allowNonBinaryArray?: boolean;
    nonBinaryArrayTransform?: fArgReturn;
}
/**
 * Defines properties on a `Object`. It make the assumption that underlying data is binary.
 * @param {Object} self the `Object` to define properties on
 * @param {Array} fields an array fields to define. Fields can contain:
 * * `name` - the name of the properties
 * * `length` - the number of bytes the field can have
 * * `allowLess` - if the field can be less than the length
 * * `allowEmpty`
 * * `allowNonBinaryArray` - if the field can be non binary array
 * * `nonBinaryArrayTransform` - function to transform each item of the non binary array
 * @param {*} [data] data to be validated against the definitions
 */
export default function defineProperties(self: Record<string, any>, fields: RlpSchemaField[], data: unknown): void;
