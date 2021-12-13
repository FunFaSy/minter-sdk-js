import {toBuffer} from '../../util';
import {TransactionType} from '../internal';
import {Action} from './action';
import {RlpSchemaField} from '../../util/define-properties';

/**
 *
 */
export interface EditCandidateActionParams {
    publicKey: string;      // Validator pub key Mp.............
    ownerAddress: string;   // All operations permitted  address Mx.............
    controlAddress: string; // SetOn, SetOff operations permitted address Mx.............
    rewardAddress: string;  // No operations permitted address. Address to get rewards Mx.............
}

/**
 *
 */
export class EditCandidateAction extends Action {
    public static readonly txType = TransactionType.EDIT_CANDIDATE;

    ownerAddress: Buffer;
    controlAddress: Buffer;
    rewardAddress: Buffer;
    publicKey: Buffer;

    constructor(data?: string | Buffer | EditCandidateActionParams) {
      let _data: any = data;

      if (typeof data == 'object' && !Buffer.isBuffer(data)) {
        _data = {
          publicKey     : toBuffer(data.publicKey),
          ownerAddress  : toBuffer(data.ownerAddress),
          controlAddress: toBuffer(data.controlAddress),
          rewardAddress : toBuffer(data.rewardAddress),
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
          name  : 'rewardAddress',
          length: 20,
        },
        {
          name  : 'ownerAddress',
          length: 20,
        },
        {
          name  : 'controlAddress',
          length: 20,
        }];
    }
}
