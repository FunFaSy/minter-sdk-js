import {toBuffer} from '../../util';
import {TransactionType} from '../internal';
import {Action} from './action';
import {RlpSchemaField} from '../../util/define-properties';
import {BN} from '../../util/external';

/**
 *
 */
export interface VoteHaltBlockActionParams {
    publicKey: string;   // Validator pub key Mp.............
    height: number | BN; // Block Height
}

/**
 *
 */
export class VoteHaltBlockAction extends Action {
    public static readonly txType = TransactionType.SET_HALT_BLOCK;

    publicKey: Buffer;
    height: Buffer;

    constructor(data?: string | Buffer | VoteHaltBlockActionParams) {
        let _data: any = data;

        if (typeof data == 'object' && !Buffer.isBuffer(data)) {
            _data = {
                publicKey: toBuffer(data.publicKey),
                height   : new BN(data.height),
            };
        }
        // TODO: Validation

        super(_data);
    }

    rlpSchema(): RlpSchemaField[] {
        return [
            {
                name  : 'publicKey',
                length: 32,
            },
            {
                name     : 'height',
                length   : 32,
                allowLess: true,
            }];
    }
}
