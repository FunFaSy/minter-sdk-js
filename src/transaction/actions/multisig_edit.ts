import {BN, toBuffer} from '../../util';
import {TransactionType} from '../internal';
import {Action} from './action';
import {RlpSchemaField} from '../../util/define-properties';

/**
 *
 */
export interface EditMultiSigActionParams {
    threshold: number | BN;        //
    weights: number[] | BN[];      //
    addresses: string[];          //
}

/**
 *
 */
export class EditMultiSigAction extends Action {
    public static readonly txType = TransactionType.EDIT_MULTISIG;

    threshold: Buffer;
    weights: Buffer[];
    addresses: Buffer[];

    constructor(params: EditMultiSigActionParams) {
        // Convert params to Buffers
        const _params = {
            threshold: new BN(params.threshold),// Should be less or equal than Weights Sum
            weights  : params.weights, // Should be greater or equal than threshold
            addresses: params.addresses,
        };

        // TODO: Validation
        // threshold Should be less or equal than Weights Sum
        // weights   Should be greater or equal than threshold

        super(_params);
    }

    rlpSchema(): RlpSchemaField[] {
        return [
            {
                name     : 'threshold',
                allowZero: false,
                // length: 2,
                // allowLess: true,
                default  : Buffer.from([]),
            }, {
                name               : 'weights',
                allowZero          : false,
                allowNonBinaryArray: true,
                nonBinaryArrayTransform(weight) {
                    return toBuffer(new BN(weight));
                },
                default            : undefined,
            }, {
                name               : 'addresses',
                allowZero          : false,
                allowNonBinaryArray: true,
                nonBinaryArrayTransform(address) {
                    return toBuffer(address);
                },
                default            : undefined,
            }];
    }
}
