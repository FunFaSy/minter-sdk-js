import {BN} from '../../util';
import {TransactionType} from '../internal';
import {Action} from './action';
import {RlpSchemaField} from '../../util/define-properties';

/**
 *
 */
export interface SellSwapActionParams {
    coins: number[] | BN[];            // Coin ID array as swap route
    valueToSell: string | BN;          // Pip units
    minimumValueToBuy?: string | BN;   // Pip units
}

/**
 *
 */
export class SellSwapAction extends Action {
    public static readonly txType = TransactionType.SELL_SWAP_POOL;

    coins: Buffer[];
    valueToSell: Buffer;
    minimumValueToBuy: Buffer;

    constructor(data?: string | Buffer | SellSwapActionParams) {
        let _data: any = data;

        if (typeof data == 'object' && !Buffer.isBuffer(data)) {
            _data = {
                coins            : data.coins.map(item => new BN(item)),
                valueToSell      : new BN(data.valueToSell),
                minimumValueToBuy: new BN(data.minimumValueToBuy),
            };
        }
        super(_data);
    }

    rlpSchema(): RlpSchemaField[] {
        return [
            {
                name               : 'coins',
                allowZero          : false,
                allowNonBinaryArray: true,
            },
            {
                name     : 'valueToSell',
                length   : 32,
                allowLess: true,
            },
            {
                name     : 'minimumValueToBuy',
                length   : 32,
                allowLess: true,
            }];
    }
}
