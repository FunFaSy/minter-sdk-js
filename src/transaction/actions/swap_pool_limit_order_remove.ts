import {BN} from '../../util';
import {TransactionType} from '../internal';
import {Action} from './action';
import {RlpSchemaField} from '../../util/define-properties';

/**
 *
 */
export interface RemoveLimitOrderActionParams {
    orderId: number | BN;  // Order ID
}

/**
 *
 */
export class RemoveLimitOrderAction extends Action {
    public static readonly txType = TransactionType.REMOVE_LIMIT_ORDER;

    orderId: Buffer;

    constructor(data?: string | Buffer | RemoveLimitOrderActionParams) {
      let _data: any = data;

      if (typeof data == 'object' && !Buffer.isBuffer(data)) {
        _data = {
          orderId: new BN(data.orderId),
        };
      }
      super(_data);
    }

    rlpSchema(): RlpSchemaField[] {
      return [
        {
          name     : 'orderId',
          length   : 4,
          allowLess: true,
        },
      ];
    }
}
