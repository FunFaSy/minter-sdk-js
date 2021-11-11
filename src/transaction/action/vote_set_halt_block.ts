import {toBuffer} from '../../util';
import {TransactionType} from '../transaction';
import {Action} from './action';
import {RlpSchemaField} from '../../util/define-properties';
import {BN} from '../../util/external';

/**
 *
 */
export interface VoteHaltBlockActionParams {
    publicKey: string;   // Validator pub key Mp.............
    height: number | BN; // Block Height
}

/**
 *
 */
export class VoteHaltBlockAction extends Action {
    publicKey: Buffer;
    height: Buffer;

    constructor(params: VoteHaltBlockActionParams) {
        // Convert params to Buffers
        const _params = {
            publicKey: toBuffer(params.publicKey),
            height: new BN(params.height),
        };

        // TODO: Validation

        super(_params);

        this.txType = TransactionType.SET_HALT_BLOCK;
    }

    rlpSchema(): RlpSchemaField[] {
        return [
            {
                name: 'publicKey',
                length: 32,
            },
            {
                name: 'height',
                length: 32,
                allowLess: true,
            }];
    }
}
