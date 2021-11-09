import {BN, RlpSchemaField, toBuffer} from '../../util';
import {TransactionType} from '../transaction';
import {Action} from './base_action';

/**
 *
 */
export interface SendActionParams {
    to: string;         // Address string
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
            coin : toBuffer(new BN(params.coin)),
            value: toBuffer(new BN(params.value)),
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
