import {BN} from '../../util';
import {TransactionType} from '../transaction';
import {Action} from './action';
import {RlpSchemaField} from '../../util/define-properties';

/**
 *
 */
export interface RemoveLiquidityActionParams {
    coin0: number | BN;             // Coin ID
    coin1: number | BN;             // Coin ID
    liquidity: string | BN;           // Pip units
    minimumVolume0?: string | BN;   // Pip units
    minimumVolume1?: string | BN;   // Pip units
}

/**
 *
 */
export class RemoveLiquidityAction extends Action {
    coin0: Buffer;
    coin1: Buffer;
    liquidity: Buffer;
    minimumVolume0: Buffer;
    minimumVolume1: Buffer;

    constructor(params: RemoveLiquidityActionParams) {
        // Convert params to Buffers
        const _params = {
            coin0         : new BN(params.coin0),
            coin1         : new BN(params.coin1),
            liquidity     : new BN(params.liquidity),
            minimumVolume0: new BN(params.minimumVolume0),
            minimumVolume1: new BN(params.minimumVolume1),
        };

        super(_params);

        this.txType = TransactionType.REMOVE_LIQUIDITY;
    }

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
                name     : 'liquidity',
                length   : 32,
                allowLess: true,
            },
            {
                name     : 'minimumVolume0',
                length   : 32,
                allowLess: true,
            },
            {
                name     : 'minimumVolume1',
                length   : 32,
                allowLess: true,
            },
        ];
    }
}
