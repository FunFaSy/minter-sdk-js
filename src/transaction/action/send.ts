import {BN,  toBuffer} from '../../util';
import {TransactionType} from '../transaction';
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
    coin: Buffer;
    to: Buffer;
    value: Buffer;

    constructor(params: SendActionParams) {
        // Convert params to Buffers
        const _params = {
            coin : new BN(params.coin),
            value: new BN(params.value),
            to   : toBuffer(params.to),
        };

        super(_params);

        this.txType = TransactionType.SEND;
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
