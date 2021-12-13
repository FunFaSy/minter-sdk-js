import {BN, toBuffer} from '../../util';
import {TransactionType} from '../internal';
import {Action} from './action';
import {RlpSchemaField} from '../../util/define-properties';

/**
 *
 */
export interface CreateMultiSigActionParams {
    threshold: number | BN;        //
    weights: number[] | BN[];      //
    addresses: string[];          //
}

/**
 *
 */
export class CreateMultiSigAction extends Action {
    public static readonly txType = TransactionType.CREATE_MULTISIG;

    threshold: Buffer;
    weights: Buffer[];
    addresses: Buffer[];

    constructor(data?: string | Buffer | CreateMultiSigActionParams) {
      let _data: any = data;

      if (typeof data == 'object' && !Buffer.isBuffer(data)) {
        _data = {
          threshold: new BN(data?.threshold),// Should be less or equal than Weights Sum
          weights  : data?.weights.map(w => new BN(w)), // Should be greater or equal than threshold
          addresses: data?.addresses,
        };
      }
      // TODO: Validation
      // threshold Should be less or equal than Weights Sum
      // weights   Should be greater or equal than threshold

      super(_data);
    }

    rlpSchema(): RlpSchemaField[] {
      return [
        {
          name     : 'threshold',
          allowZero: false,
          // length: 2,
          // allowLess: true,
          default  : Buffer.from([]),
        }, {
          name               : 'weights',
          allowZero          : false,
          allowNonBinaryArray: true,
          nonBinaryArrayTransform(weight) {
            return toBuffer(new BN(weight));
          },
          default            : Buffer.from([]),
        }, {
          name               : 'addresses',
          allowZero          : false,
          allowNonBinaryArray: true,
          nonBinaryArrayTransform(address) {
            return toBuffer(address);
          },
          default            : Buffer.from([]),
        }];
    }
}
