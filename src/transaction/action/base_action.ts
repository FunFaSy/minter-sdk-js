import {TransactionType} from '../transaction';
import {defineProperties, rlp, RlpSchemaField} from '../../util';

export abstract class Action {
    public raw!: Buffer;
    public txType: TransactionType;

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

    abstract rlpSchema(): RlpSchemaField[] ;

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

    type(): TransactionType {
        return this.txType;
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

