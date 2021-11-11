import {BN} from '../../util';
import {TransactionType} from '../transaction';
import {Action} from './action';
import {RlpSchemaField} from '../../util/define-properties';

/**
 *
 */
export interface MintTokenActionParams {
    coin: number | BN;  // Coin ID
    value: string | BN; // Pip units string
}

/**
 *
 */
export class MintTokenAction extends Action {
    coin: Buffer;
    value: Buffer;

    constructor(params: MintTokenActionParams) {
        // Convert params to Buffers
        const _params = {
            coin : new BN(params.coin),
            value: new BN(params.value),
        };

        super(_params);

        this.txType = TransactionType.MINT_TOKEN;
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
