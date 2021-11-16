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

    constructor(params: RedeemCheckActionParams) {
        // Convert params to Buffers
        const _params = {
            check: (typeof params.check == 'string') ? (new Check(params.check)).serialize() : params.check.serialize(),
            proof: (typeof params.proof == 'string') ? toBuffer(params.proof) : params.proof,
        };

        super(_params);
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
