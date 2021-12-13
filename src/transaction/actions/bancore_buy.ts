import {BN} from '../../util';
import {RlpSchemaField} from '../../util/define-properties';
import {TransactionType} from '../internal';
import {Action} from './action';

/**
 *
 */
export interface BuyActionParams {
  coinToBuy: number | BN;           // Coin ID
  coinToSell: number | BN;          // Coin ID
  valueToBuy: string | BN;          // Pip units
  maximumValueToSell?: string | BN; // Pip units
}

/**
 *
 */
export class BuyAction extends Action {
  public static readonly txType = TransactionType.BUY;

  coinToBuy: Buffer;
  valueToBuy: Buffer;
  coinToSell: Buffer;
  maximumValueToSell: Buffer;

  constructor(data?: string | Buffer | BuyActionParams) {
    let _data: any = data;

    if (typeof data == 'object' && !Buffer.isBuffer(data)) {
      _data = {
        coinToBuy         : new BN(data?.coinToBuy),
        valueToBuy        : new BN(data?.valueToBuy),
        coinToSell        : new BN(data?.coinToSell),
        maximumValueToSell: new BN(data?.maximumValueToSell),
      };
    }
    super(_data);
  }

  rlpSchema(): RlpSchemaField[] {
    return [
      {
        name     : 'coinToBuy',
        length   : 4,
        allowLess: true,
      },
      {
        name     : 'valueToBuy',
        length   : 32,
        allowLess: true,
      },
      {
        name     : 'coinToSell',
        length   : 4,
        allowLess: true,
      },
      {
        name     : 'maximumValueToSell',
        length   : 32,
        allowLess: true,
      }];
  }
}
