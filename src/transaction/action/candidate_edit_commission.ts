import {toBuffer} from '../../util';
import {TransactionType} from '../transaction';
import {Action} from './action';
import {RlpSchemaField} from '../../util/define-properties';
import {BN} from '../../util/external';

/**
 *
 */
export interface EditCandidateCommissioActionParams {
    publicKey: string;          // Validator pub key Mp.............
    commission: number | BN;    // 0-100 %
}

/**
 *
 */
export class EditCandidateCommissionAction extends Action {
    commission: Buffer;
    publicKey: Buffer;

    constructor(params: EditCandidateCommissioActionParams) {
        // Convert params to Buffers
        const _params = {
            publicKey : toBuffer(params.publicKey),
            commission: new BN(params.commission),
        };

        // TODO: Validation

        super(_params);

        this.txType = TransactionType.EDIT_CANDIDATE_COMMISSION;
    }

    rlpSchema(): RlpSchemaField[] {
        return [
            {
                name  : 'publicKey',
                length: 32,
            },
            {
                name     : 'commission',
                length   : 1,
                allowLess: true,
            },
        ];
    }
}
