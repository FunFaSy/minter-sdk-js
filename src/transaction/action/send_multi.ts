import {TransactionType} from '../transaction';
import {Action} from './action';
import {RlpSchemaField} from '../../util/define-properties';
import {SendAction} from './send';

/**
 *
 */
export interface MultiSendActionParams {
    list: SendAction[];         //
}

/**
 *
 */
export class MultiSendAction extends Action {
    list: Buffer[];

    constructor(params: MultiSendActionParams) {
        // Convert params to Buffers
        const _params = {
            list: params.list, // Pass values through to nonBinaryArrayTransform encoder function.
        };

        super(_params);

        this.txType = TransactionType.MULTISEND;
    }

    rlpSchema(): RlpSchemaField[] {
        return [
            {
                name               : 'list',
                allowZero          : false,
                default            : Buffer.from([]),
                allowNonBinaryArray: true,
                nonBinaryArrayTransform(action) {
                    return action.raw;
                },
            },
        ];
    }
}
