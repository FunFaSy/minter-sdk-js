import {TransactionType} from '../internal';
import {Action} from './action';
import {RlpSchemaField} from '../../util/define-properties';
import {Check} from '../../check/check';
import {toBuffer} from '../../util';

/**
 *
 */
export interface RedeemCheckActionParams {
    check: string | Check;  //
    proof: string | Buffer; //
}

/**
 *
 */
export class RedeemCheckAction extends Action {
    public static readonly txType = TransactionType.REDEEM_CHECK;

    check: Buffer;
    proof: Buffer;

    constructor(data?: string | Buffer | RedeemCheckActionParams) {
        let _data: any = data;

        if (typeof data == 'object' && !Buffer.isBuffer(data)) {
            _data = {
                check: (typeof data.check == 'string') ? (new Check(data.check)).serialize() : data.check.serialize(),
                proof: (typeof data.proof == 'string') ? toBuffer(data.proof) : data.proof,
            };
        }
        super(_data);
    }

    rlpSchema(): RlpSchemaField[] {
        return [
            {
                name     : 'check',
                allowZero: false,
                default  : Buffer.from([]),
            },
            {
                name     : 'proof',
                // allow DataRedeemCheck without proof (it will be filled later from password)
                allowZero: true,
                length   : 65,
                default  : Buffer.from([]),
            },
        ];
    }
}
