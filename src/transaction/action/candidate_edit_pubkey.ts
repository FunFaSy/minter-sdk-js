import {toBuffer} from '../../util';
import {TransactionType} from '../transaction';
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

        this.txType = TransactionType.EDIT_CANDIDATE_PUBLIC_KEY;
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
