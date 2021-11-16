import {BN} from '../../util';
import {TransactionType} from '../internal';
import {Action} from './action';
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
    public static readonly txType = TransactionType.ADD_LIQUIDITY;

    coin0: Buffer;
    coin1: Buffer;
    volume0: Buffer;
    maximumVolume1: Buffer;

    constructor(data?: string | Buffer | AddLiquidityActionParams) {
        let _data: any = data;

        if (typeof data == 'object' && !Buffer.isBuffer(data)) {
            _data = {
                coin0         : new BN(data?.coin0),
                coin1         : new BN(data?.coin1),
                volume0       : new BN(data?.volume0),
                maximumVolume1: new BN(data?.maximumVolume1),
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
