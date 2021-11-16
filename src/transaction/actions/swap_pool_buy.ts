import {BN} from '../../util';
import {TransactionType} from '../internal';
import {Action} from './action';
import {RlpSchemaField} from '../../util/define-properties';

/**
 *
 */
export interface BuySwapActionParams {
    coins: number[] | BN[];          // Coin ID array as swap route
    valueToBuy: string | BN;          // Pip units
    maximumValueToSell?: string | BN; // Pip units
}

/**
 *
 */
export class BuySwapAction extends Action {
    public static readonly txType = TransactionType.BUY_SWAP_POOL;

    coins: Buffer[];
    valueToBuy: Buffer;
    maximumValueToSell: Buffer;

    constructor(params: BuySwapActionParams) {

        // Convert params to Buffers
        const _params = {
            coins             : params.coins.map(item => new BN(item)),
            valueToBuy        : new BN(params.valueToBuy),
            maximumValueToSell: new BN(params.maximumValueToSell),
        };

        super(_params);
    }

    rlpSchema(): RlpSchemaField[] {
        return [
            {
                name               : 'coins',
                allowZero          : false,
                allowNonBinaryArray: true,
            },
            {
                name     : 'valueToBuy',
                length   : 32,
                allowLess: true,
            },
            {
                name     : 'maximumValueToSell',
                length   : 32,
                allowLess: true,
            }];
    }
}
