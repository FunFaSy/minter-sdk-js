import {BN} from '../../util';
import {TransactionType} from '../internal';
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
    public static readonly txType = TransactionType.CREATE_SWAP_POOL;

    coin0: Buffer;
    coin1: Buffer;
    volume0: Buffer;
    volume1: Buffer;

    constructor(data?: string | Buffer | CreateSwapPoolActionParams) {
      let _data: any = data;

      if (typeof data == 'object' && !Buffer.isBuffer(data)) {
        _data = {
          coin0  : new BN(data?.coin0),
          coin1  : new BN(data?.coin1),
          volume0: new BN(data?.volume0),
          volume1: new BN(data?.volume1),
        };
      }
      super(_data);
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
