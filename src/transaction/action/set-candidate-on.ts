import {toBuffer} from '../../util';
import {TransactionType} from '../transaction';
import {Action} from './base_action';
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
    publicKey: Buffer;

    constructor(params: SetCandidateOnActionParams) {
        // Convert params to Buffers
        const _params = {
            publicKey: toBuffer(params.publicKey),
        };

        // TODO: Validation

        super(_params);

        this.txType = TransactionType.SET_CANDIDATE_ON;
    }

    rlpSchema(): RlpSchemaField[] {
        return [
            {
                name  : 'publicKey',
                length: 32,
            }];
    }
}
