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

    constructor(params: SetCandidateOffActionParams) {
        // Convert params to Buffers
        const _params = {
            publicKey: toBuffer(params.publicKey),
        };

        // TODO: Validation

        super(_params);
    }

    rlpSchema(): RlpSchemaField[] {
        return [
            {
                name  : 'publicKey',
                length: 32,
            }];
    }
}
