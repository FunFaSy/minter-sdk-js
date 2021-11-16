import {BN} from '../../util';
import {TransactionType} from '../internal';
import {Action} from './action';
import {RlpSchemaField} from '../../util/define-properties';

/**
 *
 */
export interface AddLimitOrderActionParams {
    coinToSell: number | BN;  // Coin ID
    valueToSell: string | BN; // "minimum volume is 10000000000",
    coinToBuy: number | BN;   // Coin ID
    valueToBuy: string | BN;  // "minimum volume is 10000000000",
}

/**
 *
 */
export class AddLimitOrderAction extends Action {
    public static readonly txType = TransactionType.ADD_LIMIT_ORDER;

    coinToSell: Buffer;
    valueToSell: Buffer;
    coinToBuy: Buffer;
    valueToBuy: Buffer;

    constructor(data?: string | Buffer | AddLimitOrderActionParams) {
        let _data: any = data;

        if (typeof data == 'object' && !Buffer.isBuffer(data)) {
            _data = {
                coinToSell : new BN(data?.coinToSell),
                valueToSell: new BN(data?.valueToSell),
                coinToBuy  : new BN(data?.coinToBuy),
                valueToBuy : new BN(data?.valueToBuy),
            };
        }
        super(_data);
    }

    rlpSchema(): RlpSchemaField[] {
        return [
            {
                name     : 'coinToSell',
                length   : 4,
                allowLess: true,
            },
            {
                name     : 'valueToSell',
                length   : 32,
                allowLess: true,
            },
            {
                name     : 'coinToBuy',
                length   : 4,
                allowLess: true,
            },
            {
                name     : 'valueToBuy',
                length   : 32,
                allowLess: true,
            },
        ];
    }
}
