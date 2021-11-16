import {toBuffer} from '../../util';
import {TransactionType} from '../internal';
import {Action} from './action';
import {RlpSchemaField} from '../../util/define-properties';

/**
 *
 */
export interface EditCandidatePubKeyActionParams {
    publicKey: string;      // Validator pub key Mp.............
    newPublicKey: string;   // Validator pub key Mp.............
}

/**
 *
 */
export class EditCandidatePubKeyAction extends Action {
    public static readonly txType = TransactionType.EDIT_CANDIDATE_PUBLIC_KEY;

    newPublicKey: Buffer;
    publicKey: Buffer;

    constructor(params: EditCandidatePubKeyActionParams) {
        // Convert params to Buffers
        const _params = {
            publicKey   : toBuffer(params.publicKey),
            newPublicKey: toBuffer(params.newPublicKey),
        };

        // TODO: Validation

        super(_params);

    }

    rlpSchema(): RlpSchemaField[] {
        return [
            {
                name  : 'publicKey',
                length: 32,
            },
            {
                name  : 'newPublicKey',
                length: 32,
            },
        ];
    }
}
