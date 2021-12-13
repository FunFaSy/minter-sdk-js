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

    constructor(data?: string | Buffer | BurnTokenActionParams) {
      let _data: any = data;

      if (typeof data == 'object' && !Buffer.isBuffer(data)) {
        _data = {
          coin : new BN(data.coin),
          value: new BN(data.value),
        };
      }
      super(_data);
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
