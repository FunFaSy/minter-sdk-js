import {toBuffer} from '../../util';
import {TransactionType} from '../transaction';
import {Action} from './base_action';
import {RlpSchemaField} from '../../util/define-properties';
import {BN} from '../../util/external';

/**
 *
 */
export interface UnbondActionParams {
    publicKey: string;    // Validator pub key Mp.............
    coin: number | BN;    //
    stake: string | BN;   //
}

/**
 *
 */
export class UnbondAction extends Action {
    coin: Buffer;
    stake: Buffer;
    publicKey: Buffer;

    constructor(params: UnbondActionParams) {
        // Convert params to Buffers
        const _params = {
            publicKey: toBuffer(params.publicKey),
            coin     : new BN(params.coin),
            stake    : new BN(params.stake)
        };

        // TODO: Validation

        super(_params);

        this.txType = TransactionType.UNBOND;
    }

    rlpSchema(): RlpSchemaField[] {
        return [
            {
                name  : 'publicKey',
                length: 32,
            },
            {
                name     : 'coin',
                length   : 4,
                allowLess: true,
            },
            {
                name     : 'stake',
                length   : 32,
                allowLess: true,
            }];
    }
}
