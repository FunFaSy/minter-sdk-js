import {BN} from '../../util';
import {TransactionType} from '../transaction';
import {Action} from './base_action';
import {RlpSchemaField} from '../../util/define-properties';

/**
 *
 */
export interface AddLiquidityActionParams {
    coin0: number | BN;             // Coin ID
    coin1: number | BN;             // Coin ID
    volume0: string | BN;           // Pip units
    maximumVolume1?: string | BN;   // Pip units
}

/**
 *
 */
export class AddLiquidityAction extends Action {
    coin0: Buffer;
    coin1: Buffer;
    volume0: Buffer;
    maximumVolume1: Buffer;

    constructor(params: AddLiquidityActionParams) {
        // Convert params to Buffers
        const _params = {
            coin0         : new BN(params.coin0),
            coin1         : new BN(params.coin1),
            volume0       : new BN(params.volume0),
            maximumVolume1: new BN(params.maximumVolume1),
        };

        super(_params);

        this.txType = TransactionType.ADD_LIQUIDITY;
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
                name     : 'volume0',
                length   : 32,
                allowLess: true,
            },
            {
                name     : 'maximumVolume1',
                length   : 32,
                allowLess: true,
            },
        ];
    }
}
