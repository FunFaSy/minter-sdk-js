/** @hidden @module */

import {ethAddress, PrefixedHexString} from './external';

/**
 * A type that represents an Address-like value.
 * To convert to address, use `new Address(toBuffer(value))`
 */
export type AddressLike = ethAddress | Buffer | PrefixedHexString

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

export type IBuilder<T> = {
  [k in keyof T]: (arg: T[k]) => IBuilder<T>
} & { build(): T }

export class PipelineBuilder<Input, Config extends Record<string, any>, Output> {
  private readonly stages: Array<(state: any, config: Config) => any>;

  private constructor(stages: Array<(state: any, config: Config) => any>) {
    this.stages = stages;
  }

  static new<Input>(): PipelineBuilder<Input, Record<string, unknown>, Input> {
    return new PipelineBuilder([]);
  }

  append<NewConfig extends Record<string, any>, NewOutput>(
    newStage: (state: Output, config: NewConfig) => NewOutput,
  ): PipelineBuilder<Input, Config & NewConfig, NewOutput> {
    const newStages: Array<(state: any, config: Config & NewConfig) => any> = this.stages.slice();
    newStages.push(newStage);
    return new PipelineBuilder<Input, Config & NewConfig, NewOutput>(newStages);
  }

  build(): (input: Input, config: Config) => Output {
    return (input: Input, config: Config) =>
      this.stages.reduce((state, stage) => stage(state, config), input);
  }
}

export type Constructor<T extends unknown = unknown> = new (...args: any[]) => T;

export  type fEmptyVoid = () => void;
export  type fEmptyReturn = () => any;
export  type fArgVoid = (...args: any[]) => void;
export  type fArgReturn = (...args: any[]) => any;
