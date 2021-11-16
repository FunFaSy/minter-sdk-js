import {toBuffer} from '../../util';
import {TransactionType} from '../internal';
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
    public static readonly txType = TransactionType.EDIT_CANDIDATE_COMMISSION;

    commission: Buffer;
    publicKey: Buffer;

    constructor(data?: string | Buffer | EditCandidateCommissioActionParams) {
        let _data: any = data;

        if (typeof data == 'object' && !Buffer.isBuffer(data)) {
            _data = {
                publicKey : toBuffer(data.publicKey),
                commission: new BN(data.commission),
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
                name     : 'commission',
                length   : 1,
                allowLess: true,
            },
        ];
    }
}
