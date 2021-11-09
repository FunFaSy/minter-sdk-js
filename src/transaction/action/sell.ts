import {BN} from '../../util';
import {TransactionType} from '../transaction';
import {Action} from './base_action';
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
    coinToSell: Buffer;
    valueToSell: Buffer;
    coinToBuy: Buffer;
    minimumValueToBuy: Buffer;

    constructor(params: SellActionParams) {
        // Convert params to Buffers
        const _params = {
            coinToSell       : new BN(params.coinToSell),
            valueToSell      : new BN(params.valueToSell),
            coinToBuy        : new BN(params.coinToBuy),
            minimumValueToBuy: new BN(params.minimumValueToBuy),
        };

        super(_params);

        this.txType = TransactionType.SELL;
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
