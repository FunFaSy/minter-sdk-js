import {BN, RlpSchemaField, toBuffer} from '../../util';
import {TransactionType} from '../transaction';
import {Action} from './base_action';

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
    coinToBuy: Buffer;
    valueToBuy: Buffer;
    coinToSell: Buffer;
    maximumValueToSell: Buffer;

    constructor(params: BuyActionParams) {
        // Convert params to Buffers
        const _params = {
            coinToBuy         : toBuffer(new BN(params.coinToBuy)),
            valueToBuy        : toBuffer(new BN(params.valueToBuy)),
            coinToSell        : toBuffer(new BN(params.coinToSell)),
            maximumValueToSell: toBuffer(new BN(params.maximumValueToSell)),
        };

        super(_params);

        this.txType = TransactionType.BUY;

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
