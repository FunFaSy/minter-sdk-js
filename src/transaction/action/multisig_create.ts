import {BN, toBuffer} from '../../util';
import {TransactionType} from '../transaction';
import {Action} from './action';
import {RlpSchemaField} from '../../util/define-properties';

/**
 *
 */
export interface CreateMultiSigActionParams {
    threshold: number | BN;        //
    weights: number[] | BN[];      //
    addresses: string[];          //
}

/**
 *
 */
export class CreateMultiSigAction extends Action {
    threshold: Buffer;
    weights: Buffer[];
    addresses: Buffer[];

    constructor(params: CreateMultiSigActionParams) {
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

        this.txType = TransactionType.CREATE_MULTISIG;

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
                default            : Buffer.from([]),
            }, {
                name               : 'addresses',
                allowZero          : false,
                allowNonBinaryArray: true,
                nonBinaryArrayTransform(address) {
                    return toBuffer(address);
                },
                default            : Buffer.from([]),
            }];
    }
}
