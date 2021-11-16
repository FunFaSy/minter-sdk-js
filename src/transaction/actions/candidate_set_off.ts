import {toBuffer} from '../../util';
import {TransactionType} from '../internal';
import {Action} from './action';
import {RlpSchemaField} from '../../util/define-properties';

/**
 *
 */
export interface SetCandidateOffActionParams {
    publicKey: string;         // Validator pub key Mp.............
}

/**
 *
 */
export class SetCandidateOffAction extends Action {
    public static readonly txType = TransactionType.SET_CANDIDATE_OFF;

    publicKey: Buffer;

    constructor(data?: string | Buffer | SetCandidateOffActionParams) {
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
