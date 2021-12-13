import {toBuffer} from '../../util';
import {TransactionType} from '../internal';
import {Action} from './action';
import {RlpSchemaField} from '../../util/define-properties';

/**
 *
 */
export interface SetCandidateOnActionParams {
    publicKey: string;         // Validator pub key Mp.............
}

/**
 *
 */
export class SetCandidateOnAction extends Action {
    public static readonly txType = TransactionType.SET_CANDIDATE_ON;

    publicKey: Buffer;

    constructor(data?: string | Buffer | SetCandidateOnActionParams) {
      let _data: any = data;

      if (typeof data == 'object' && !Buffer.isBuffer(data)) {
        _data = {
          publicKey: toBuffer(data.publicKey),
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
        }];
    }
}
