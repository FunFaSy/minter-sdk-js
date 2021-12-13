import {toBuffer} from '../../util';
import {TransactionType} from '../internal';
import {Action} from './action';
import {RlpSchemaField} from '../../util/define-properties';
import {BN} from '../../util/external';

/**
 *
 */
export interface DelegateActionParams {
    publicKey: string;    // Validator pub key Mp.............
    coin: number | BN;    //
    stake: string | BN;   //
}

/**
 *
 */
export class DelegateAction extends Action {
    public static readonly txType = TransactionType.DELEGATE;

    coin: Buffer;
    stake: Buffer;
    publicKey: Buffer;

    constructor(data?: string | Buffer | DelegateActionParams) {
      let _data: any = data;

      if (typeof data == 'object' && !Buffer.isBuffer(data)) {
        _data = {
          publicKey: toBuffer(data.publicKey),
          coin     : new BN(data.coin),
          stake    : new BN(data.stake),
        };
      }
      // TODO: Validation

      super(_data);
    }

    rlpSchema(): RlpSchemaField[] {
      return [
        {
          name  : 'publicKey',
          length: 32,
        },
        {
          name     : 'coin',
          length   : 4,
          allowLess: true,
        },
        {
          name     : 'stake',
          length   : 32,
          allowLess: true,
        }];
    }
}
