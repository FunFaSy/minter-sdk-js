import {BN} from '../../util';
import {TransactionType} from '../internal';
import {Action} from './action';
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
    public static readonly txType = TransactionType.SELL_ALL_SWAP_POOL;

    coins: Buffer[];
    minimumValueToBuy: Buffer;

    constructor(data?: string | Buffer | SellAllSwapActionParams) {
      let _data: any = data;

      if (typeof data == 'object' && !Buffer.isBuffer(data)) {
        _data = {
          coins            : data.coins.map(item => new BN(item)),
          minimumValueToBuy: new BN(data.minimumValueToBuy),
        };
      }
      super(_data);
    }

    rlpSchema(): RlpSchemaField[] {
      return [
        {
          name               : 'coins',
          allowNonBinaryArray: true,
        },
        {
          name     : 'minimumValueToBuy',
          length   : 32,
          allowLess: true,
        }];
    }
}
