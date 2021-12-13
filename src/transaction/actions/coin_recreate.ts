import {BN} from '../../util';
import {TransactionType} from '../internal';
import {Action} from './action';
import {RlpSchemaField} from '../../util/define-properties';

/**
 *
 */
export interface ReCreateCoinActionParams {
    name: string;                           // Human readable Coin Name
    symbol: string;                         // Coin Symbol aka Ticker
    initialAmount: string | BN;             // Pip units
    initialReserve: string | BN;            // Pip units
    constantReserveRatio: number | BN;      // Pip units
    maxSupply?: string | BN;                 // Pip units
}

/**
 *
 */
export class ReCreateCoinAction extends Action {
    public static readonly txType = TransactionType.RECREATE_COIN;

    name: Buffer;
    symbol: Buffer;
    initialAmount: Buffer;
    initialReserve: Buffer;
    constantReserveRatio: Buffer;
    maxSupply?: Buffer;

    /**
     *
     * @param params
     */
    constructor(data?: string | Buffer | ReCreateCoinActionParams) {
      let _data: any = data;

      if (typeof data == 'object' && !Buffer.isBuffer(data)) {
        _data = {
          name                : Buffer.from(data.name, 'utf8'),
          symbol              : Buffer.from(data.symbol, 'utf8'),
          initialAmount       : new BN(data.initialAmount),
          initialReserve      : new BN(data.initialReserve),
          constantReserveRatio: new BN(data.constantReserveRatio),
          maxSupply           : new BN(data.maxSupply),
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
          name   : 'name',
          default: Buffer.from([]),
        }, {
          name  : 'symbol',
          length: 10,
        }, {
          name     : 'initialAmount',
          length   : 32,
          allowLess: true,
        }, {
          name     : 'initialReserve',
          length   : 32,
          allowLess: true,
        }, {
          name     : 'constantReserveRatio',
          length   : 1,
          allowLess: true,
        }, {
          name     : 'maxSupply',
          length   : 32,
          allowLess: true,
        }];
    }
}
