import {BN} from '../../util';
import {TransactionType} from '../transaction';
import {Action} from './base_action';
import {RlpSchemaField} from '../../util/define-properties';

/**
 *
 */
export interface SellAllActionParams {
    coinToSell: number | BN;          // Coin ID
    coinToBuy: number | BN;           // Coin ID
    minimumValueToBuy?: string | BN;  // Pip units
}

/**
 *
 */
export class SellAllAction extends Action {
    coinToSell: Buffer;
    coinToBuy: Buffer;
    minimumValueToBuy: Buffer;

    constructor(params: SellAllActionParams) {
        // Convert params to Buffers
        const _params = {
            coinToSell       : new BN(params.coinToSell),
            coinToBuy        : new BN(params.coinToBuy),
            minimumValueToBuy: new BN(params.minimumValueToBuy),
        };

        super(_params);

        this.txType = TransactionType.SELL_ALL;
    }

    rlpSchema(): RlpSchemaField[] {
        return [
            {
                name     : 'coinToSell',
                length   : 4,
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
