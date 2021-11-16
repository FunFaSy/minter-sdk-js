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

    constructor(params: AddLimitOrderActionParams) {
        // Convert params to Buffers
        const _params = {
            coinToSell : new BN(params.coinToSell),
            valueToSell: new BN(params.valueToSell),
            coinToBuy  : new BN(params.coinToBuy),
            valueToBuy : new BN(params.valueToBuy),
        };

        super(_params);
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
