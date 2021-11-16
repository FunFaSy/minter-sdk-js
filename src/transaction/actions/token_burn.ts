import {BN} from '../../util';
import {TransactionType} from '../internal';
import {Action} from './action';
import {RlpSchemaField} from '../../util/define-properties';

/**
 *
 */
export interface BurnTokenActionParams {
    coin: number | BN;  // Coin ID
    value: string | BN; // Pip units string
}

/**
 *
 */
export class BurnTokenAction extends Action {
    public static readonly txType = TransactionType.BURN_TOKEN;

    coin: Buffer;
    value: Buffer;

    constructor(params: BurnTokenActionParams) {
        // Convert params to Buffers
        const _params = {
            coin : new BN(params.coin),
            value: new BN(params.value),
        };

        super(_params);
    }

    rlpSchema(): RlpSchemaField[] {
        return [
            {
                name     : 'coin',
                length   : 4,
                allowLess: true,
            },
            {
                name     : 'value',
                length   : 32,
                allowLess: true,
            }];
    }
}
