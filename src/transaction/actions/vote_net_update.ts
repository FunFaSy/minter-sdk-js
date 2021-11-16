import {toBuffer} from '../../util';
import {TransactionType} from '../internal';
import {Action} from './action';
import {RlpSchemaField} from '../../util/define-properties';
import {BN} from '../../util/external';

/**
 *
 */
export interface VoteNetUpdateActionParams {
    publicKey: string;   // Validator pub key Mp.............
    height: number | BN; // Block Height
    version: string;    // Version @example 'v2_1'
}

/**
 *
 */
export class VoteNetUpdateAction extends Action {
    public static readonly txType = TransactionType.VOTE_UPDATE;

    publicKey: Buffer;
    height: Buffer;
    version: Buffer;

    constructor(params: VoteNetUpdateActionParams) {
        // Convert params to Buffers
        const _params = {
            publicKey: toBuffer(params.publicKey),
            version  : Buffer.from(params.version, 'utf8'),
            height   : new BN(params.height),
        };

        // TODO: Validation
        // version regexp("^[a-zA-Z0-9_]{1,20}$")
        super(_params);
    }

    rlpSchema(): RlpSchemaField[] {
        return [
            {
                name: 'version',
            },
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
