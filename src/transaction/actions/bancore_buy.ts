import {BN} from '../../util';
import {RlpSchemaField} from '../../util/define-properties';
import {TransactionType} from '../internal';
import {Action} from './action';

/**
 *
 */
export interface BuyActionParams {
    coinToBuy: number | BN;           // Coin ID
    coinToSell: number | BN;          // Coin ID
    valueToBuy: string | BN;          // Pip units
    maximumValueToSell?: string | BN; // Pip units
}

/**
 *
 */
export class BuyAction extends Action {
    public static readonly txType= TransactionType.BUY;

    coinToBuy: Buffer;
    valueToBuy: Buffer;
    coinToSell: Buffer;
    maximumValueToSell: Buffer;

    constructor(params: BuyActionParams) {
        // Convert params to Buffers
        const _params = {
            coinToBuy         : new BN(params.coinToBuy),
            valueToBuy        : new BN(params.valueToBuy),
            coinToSell        : new BN(params.coinToSell),
            maximumValueToSell: new BN(params.maximumValueToSell),
        };

        super(_params);
    }

    rlpSchema(): RlpSchemaField[] {
        return [
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
            {
                name     : 'coinToSell',
                length   : 4,
                allowLess: true,
            },
            {
                name     : 'maximumValueToSell',
                length   : 32,
                allowLess: true,
            }];
    }
}
