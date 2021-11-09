import {BN} from '../../util';
import {TransactionType} from '../transaction';
import {Action} from './base_action';
import {RlpSchemaField} from '../../util/define-properties';

/**
 *
 */
export interface SellAllSwapActionParams {
    coins: number[] | BN[];            // Coin ID array as swap route
    minimumValueToBuy?: string | BN;   // Pip units
}

/**
 *
 */
export class SellAllSwapAction extends Action {
    coins: Buffer[];
    minimumValueToBuy: Buffer;

    constructor(params: SellAllSwapActionParams) {

        // Convert params to Buffers
        const _params = {
            coins             : params.coins.map(item => new BN(item)),
            minimumValueToBuy : new BN(params.minimumValueToBuy),
        };

        super(_params);

        this.txType = TransactionType.SELL_ALL_SWAP_POOL;

    }

    rlpSchema(): RlpSchemaField[] {
        return [
            {
                name: 'coins',
                allowNonBinaryArray: true,
            },
            {
                name: 'minimumValueToBuy',
                length: 32,
                allowLess: true,
            }];
    }
}
