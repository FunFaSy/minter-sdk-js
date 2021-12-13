import {BN} from '../../util';
import {TransactionType} from '../internal';
import {Action} from './action';
import {RlpSchemaField} from '../../util/define-properties';

/**
 *
 */
export interface ReCreateTokenActionParams {
    name: string;                           // Human readable Token Name
    symbol: string;                         // Token Symbol aka Ticker
    initialAmount: string | BN;             // Pip units
    maxSupply?: string | BN;                 // Pip units
    mintable?: boolean;                     //
    burnable?: boolean;                     //
}

/**
 *
 */
export class ReCreateTokenAction extends Action {
    public static readonly txType = TransactionType.RECREATE_TOKEN;

    name: Buffer;
    symbol: Buffer;
    initialAmount: Buffer;
    maxSupply?: Buffer;
    mintable?: Buffer;
    burnable?: Buffer;

    constructor(data?: string | Buffer | ReCreateTokenActionParams) {
      let _data: any = data;

      if (typeof data == 'object' && !Buffer.isBuffer(data)) {
        _data = {
          name         : Buffer.from(data.name, 'utf8'),
          symbol       : Buffer.from(data.symbol, 'utf8'),
          initialAmount: new BN(data.initialAmount),
          maxSupply    : new BN(data.maxSupply),
          mintable     : data.mintable ? new BN(1) : new BN(0),
          burnable     : data.burnable ? new BN(1) : new BN(0),
        };
      }
      // TODO: Validation
      // "Maximum supply cannot be more than the initial amount, if the token is not mintable"
      // "Symbol max len 10"
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
          name     : 'maxSupply',
          length   : 32,
          allowLess: true,
        }, {
          name     : 'mintable',
          length   : 1,
          allowLess: true,
        }, {
          name     : 'burnable',
          length   : 1,
          allowLess: true,
        }];
    }
}
