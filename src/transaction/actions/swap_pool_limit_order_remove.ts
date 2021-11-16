import {BN} from '../../util';
import {TransactionType} from '../internal';
import {Action} from './action';
import {RlpSchemaField} from '../../util/define-properties';

/**
 *
 */
export interface RemoveLimitOrderActionParams {
    orderId: number | BN;  // Order ID
}

/**
 *
 */
export class RemoveLimitOrderAction extends Action {
    public static readonly txType = TransactionType.REMOVE_LIMIT_ORDER;

    orderId: Buffer;

    constructor(params: RemoveLimitOrderActionParams) {
        // Convert params to Buffers
        const _params = {
            orderId: new BN(params.orderId),
        };

        super(_params);
    }

    rlpSchema(): RlpSchemaField[] {
        return [
            {
                name     : 'orderId',
                length   : 4,
                allowLess: true,
            },
        ];
    }
}
