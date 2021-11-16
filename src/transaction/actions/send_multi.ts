import {TransactionType} from '../internal';
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
    public static readonly txType = TransactionType.MULTISEND;

    list: Buffer[];

    constructor(data?: string | Buffer | MultiSendActionParams) {
        let _data: any = data;

        if (typeof data == 'object' && !Buffer.isBuffer(data)) {
            _data = {
                list: data?.list || [], // Pass values through to nonBinaryArrayTransform encoder function.
            };
        }
        super(_data);
    }

    rlpSchema(): RlpSchemaField[] {
        return [
            {
                name               : 'list',
                allowZero          : false,
                default            : Buffer.from([]),
                allowNonBinaryArray: true,
                nonBinaryArrayTransform(action) {
                    // In case transaction restored from string
                    return (action instanceof SendAction) ? action.raw : action;
                },
            },
        ];
    }
}
