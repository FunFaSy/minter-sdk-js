import {TransactionType} from '../transaction';
import {Action} from './action';
import {RlpSchemaField} from '../../util/define-properties';
import {Check} from '../../check/check';

/**
 *
 */
export interface RedeemCheckActionParams {
    check: Check;           //
    proof: Buffer;          //
}

/**
 *
 */
export class RedeemCheckAction extends Action {
    check: Buffer;
    proof: Buffer;

    constructor(params: RedeemCheckActionParams) {
        // Convert params to Buffers
        const _params = {
            check: params.check.raw,
            proof: params.proof,
        };

        super(_params);

        this.txType = TransactionType.REDEEM_CHECK;

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
