import {BN, toBuffer} from '../../util';
import {TransactionType} from '../internal';
import {Action} from './action';
import {RlpSchemaField} from '../../util/define-properties';

/**
 *
 */
export interface DeclareCandidacyActionParams {
    address: string;            // Validator owner  address Mx.............
    publicKey: string;          // Validator pub key Mp.............
    commission: number | BN;    // 0-100 %
    coin: number | BN;          // Coin ID .Initial self bonded Stake coin
    stake: string | BN;         // PIP units to Stake value
}

/**
 *
 */
export class DeclareCandidacyAction extends Action {
    public static readonly txType = TransactionType.DECLARE_CANDIDACY;

    address: Buffer;
    publicKey: Buffer;
    commission: Buffer;
    coin: Buffer;
    stake: Buffer;

    constructor(data?: string | Buffer | DeclareCandidacyActionParams) {
        let _data: any = data;

        if (typeof data == 'object' && !Buffer.isBuffer(data)) {
            _data = {
                address   : toBuffer(data.address),
                publicKey : toBuffer(data.publicKey),
                commission: new BN(data.commission),
                coin      : new BN(data.coin),
                stake     : new BN(data.stake),
            };
        }
        // TODO: Validation

        super(_data);
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
