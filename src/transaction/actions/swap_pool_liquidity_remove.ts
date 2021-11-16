import {BN} from '../../util';
import {TransactionType} from '../internal';
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
    public static readonly txType = TransactionType.REMOVE_LIQUIDITY;

    coin0: Buffer;
    coin1: Buffer;
    liquidity: Buffer;
    minimumVolume0: Buffer;
    minimumVolume1: Buffer;

    constructor(data?: string | Buffer | RemoveLiquidityActionParams) {
        let _data: any = data;

        if (typeof data == 'object' && !Buffer.isBuffer(data)) {
            _data = {
                coin0         : new BN(data?.coin0),
                coin1         : new BN(data?.coin1),
                liquidity     : new BN(data?.liquidity),
                minimumVolume0: new BN(data?.minimumVolume0),
                minimumVolume1: new BN(data?.minimumVolume1),
            };
        }
        super(_data);
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
