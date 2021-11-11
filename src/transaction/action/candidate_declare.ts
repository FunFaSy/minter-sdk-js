import {BN, toBuffer} from '../../util';
import {TransactionType} from '../transaction';
import {Action} from './action';
import {RlpSchemaField} from '../../util/define-properties';

/**
 *
 */
export interface DeclareCandidacyActionParams {
    address: string ;            // Validator owner  address Mx.............
    publicKey: string ;          // Validator pub key Mp.............
    commission: number | BN;    // 0-100 %
    coin: number | BN;          // Coin ID .Initial self bonded Stake coin
    stake: string | BN;         // PIP units to Stake value
}

/**
 *
 */
export class DeclareCandidacyAction extends Action {
    address: Buffer;
    publicKey: Buffer;
    commission: Buffer;
    coin: Buffer;
    stake: Buffer;

    constructor(params: DeclareCandidacyActionParams) {
        // Convert params to Buffers
        const _params = {
            address   : toBuffer(params.address),
            publicKey : toBuffer(params.publicKey),
            commission: new BN(params.commission),
            coin      : new BN(params.coin),
            stake     : new BN(params.stake),
        };

        // TODO: Validation

        super(_params);

        this.txType = TransactionType.DECLARE_CANDIDACY;
    }

    rlpSchema(): RlpSchemaField[] {
        return [
            {
                name  : 'address',
                length: 20,
            },
            {
                name  : 'publicKey',
                length: 32,
            },
            {
                name     : 'commission',
                length   : 1,
                allowLess: true,
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
                default  : Buffer.from([]),
            }];
    }
}
