import {BN} from '../../util';
import {TransactionType} from '../transaction';
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
    coins: Buffer[];
    valueToSell: Buffer;
    minimumValueToBuy: Buffer;

    constructor(params: SellSwapActionParams) {

        // Convert params to Buffers
        const _params = {
            coins             : params.coins.map(item => new BN(item)),
            valueToSell       : new BN(params.valueToSell),
            minimumValueToBuy : new BN(params.minimumValueToBuy),
        };

        super(_params);

        this.txType = TransactionType.SELL_SWAP_POOL;

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
