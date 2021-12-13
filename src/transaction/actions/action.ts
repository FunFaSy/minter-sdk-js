import {TransactionType} from '../internal';

import defineProperties, {RlpSchemaField} from '../../util/define-properties';
import {rlp} from '../../util';

/**
 *
 */
export abstract class Action {
    static readonly txType: TransactionType = undefined;
    public raw!: Buffer[];

    constructor(data) {
      /**
         * Returns the rlp encoding of the transaction
         * @method serialize
         * @return {Buffer}
         * @memberof Transaction
         * @name serialize
         */
      // attached serialize
      defineProperties(this, this.rlpSchema(), data);
    }

    static constructorByType(type: TransactionType): Action {
      return undefined;
    }

    abstract rlpSchema(): RlpSchemaField[] ;

    type(): TransactionType {
      const self = Object.getPrototypeOf(this).constructor;
      return self.txType as TransactionType;
    }

    /**
     *
     */
    getRaw(): Buffer[] {
      return this.raw;
    }

    /**
     * Returns the rlp encoding of the action
     */
    encode(): Buffer {
      return this.serialize();
    }

    /**
     * Returns the rlp encoding of the action
     */
    serialize(): Buffer {
      // Note: This never gets executed, defineProperties overwrites it.
      return rlp.encode(this.raw);
    }

    /**
     * Return 0x prefixed hex of `serialise` method result
     */
    serializeToString(): string {
      // Note: This never gets executed, defineProperties overwrites it.
      return '';
    }

    /**
     * Returns the action in JSON format
     * @see {@link https://github.com/ethereumjs/ethereumjs-util/blob/master/docs/index.md#defineproperties|ethereumjs-util}
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    toJSON(labels = false): { [key: string]: string } | string[] {
      // Note: This never gets executed, defineProperties overwrites it.
      return {};
    }
}
