import {toBuffer} from '../../util';
import {TransactionType} from '../transaction';
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
    ownerAddress: Buffer;
    controlAddress: Buffer;
    rewardAddress: Buffer;
    publicKey: Buffer;

    constructor(params: EditCandidateActionParams) {
        // Convert params to Buffers
        const _params = {
            publicKey     : toBuffer(params.publicKey),
            ownerAddress  : toBuffer(params.ownerAddress),
            controlAddress: toBuffer(params.controlAddress),
            rewardAddress : toBuffer(params.rewardAddress),
        };

        // TODO: Validation

        super(_params);

        this.txType = TransactionType.EDIT_CANDIDATE;
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
