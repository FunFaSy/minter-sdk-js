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
export declare type IBuilder<T> = {
    [k in keyof T]: (arg: T[k]) => IBuilder<T>;
} & {
    build(): T;
};
export declare class PipelineBuilder<Input, Config extends Record<string, any>, Output> {
    private readonly stages;
    private constructor();
    static new<Input>(): PipelineBuilder<Input, Record<string, unknown>, Input>;
    append<NewConfig extends Record<string, any>, NewOutput>(newStage: (state: Output, config: NewConfig) => NewOutput): PipelineBuilder<Input, Config & NewConfig, NewOutput>;
    build(): (input: Input, config: Config) => Output;
}
export declare type Constructor<T extends unknown = unknown> = new (...args: any[]) => T;
export declare type fEmptyVoid = () => void;
export declare type fEmptyReturn = () => any;
export declare type fArgVoid = (...args: any[]) => void;
export declare type fArgReturn = (...args: any[]) => any;
