import {BN, toBuffer} from '../../util';
import {TransactionType} from '../internal';
import {Action} from './action';
import {RlpSchemaField} from '../../util/define-properties';

/**
 *
 */
export interface SendActionParams {
    to: string;         // Address string Mx or 0x prefixed
    coin: number | BN;  // Coin ID
    value: string | BN; // Pip units string
}

/**
 *
 */
export class SendAction extends Action {
    public static readonly txType = TransactionType.SEND;

    coin: Buffer;
    to: Buffer;
    value: Buffer;

    constructor(data?: string | Buffer | SendActionParams) {
        let _data: any = data;

        if (typeof data == 'object' && !Buffer.isBuffer(data)) {
            _data = {
                coin : data.coin ? new BN(data.coin) : undefined,
                value: data.value ? new BN(data.value) : undefined,
                to   : data.to ? toBuffer(data.to) : undefined,
            };
        }

        super(_data);
    }

    rlpSchema(): RlpSchemaField[] {
        return [
            {
                name     : 'coin',
                length   : 4,
                allowLess: true,
            }
            , {
                name  : 'to',
                length: 20,
            }
            , {
                name     : 'value',
                length   : 32,
                allowLess: true,
            }];
    }
}
