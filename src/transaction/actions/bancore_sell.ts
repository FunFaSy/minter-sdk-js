import {BN} from '../../util';
import {TransactionType} from '../internal';
import {Action} from './action';
import {RlpSchemaField} from '../../util/define-properties';

/**
 *
 */
export interface SellActionParams {
    coinToSell: number | BN;          // Coin ID
    coinToBuy: number | BN;           // Coin ID
    valueToSell: string | BN;         // Pip units string
    minimumValueToBuy?: string | BN;  // Pip units
}

/**
 *
 */
export class SellAction extends Action {
    public static readonly txType = TransactionType.SELL;

    coinToSell: Buffer;
    valueToSell: Buffer;
    coinToBuy: Buffer;
    minimumValueToBuy: Buffer;

    constructor(data?: string | Buffer | SellActionParams) {
        let _data: any = data;

        if (typeof data == 'object' && !Buffer.isBuffer(data)) {
            _data = {
                coinToSell       : new BN(data?.coinToSell),
                valueToSell      : new BN(data?.valueToSell),
                coinToBuy        : new BN(data?.coinToBuy),
                minimumValueToBuy: new BN(data?.minimumValueToBuy),
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
                name     : 'minimumValueToBuy',
                length   : 32,
                allowLess: true,
            }];
    }
}
