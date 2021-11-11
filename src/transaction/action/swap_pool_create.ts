import {BN} from '../../util';
import {TransactionType} from '../transaction';
import {Action} from './action';
import {RlpSchemaField} from '../../util/define-properties';

/**
 *
 */
export interface CreateSwapPoolActionParams {
    coin0: number | BN;             // Coin ID
    coin1: number | BN;             // Coin ID
    volume0: string | BN;           // Pip units
    volume1: string | BN;           // Pip units
}

/**
 *
 */
export class CreateSwapPoolAction extends Action {
    coin0: Buffer;
    coin1: Buffer;
    volume0: Buffer;
    volume1: Buffer;

    /**
     *
     * @param params
     */
    constructor(params: CreateSwapPoolActionParams) {
        // Convert params to Buffers
        const _params = {
            coin0  : new BN(params.coin0),
            coin1  : new BN(params.coin1),
            volume0: new BN(params.volume0),
            volume1: new BN(params.volume1),
        };

        super(_params);

        this.txType = TransactionType.CREATE_SWAP_POOL;
    }

    /**
     *
     */
    rlpSchema(): RlpSchemaField[] {
        return [
            {
                name     : 'coin0',
                length   : 4,
                allowLess: true,
            },
            {
                name     : 'coin1',
                length   : 4,
                allowLess: true,
            },
            {
                name     : 'volume0',
                length   : 32,
                allowLess: true,
            },
            {
                name     : 'volume1',
                length   : 32,
                allowLess: true,
            },
        ];
    }
}
