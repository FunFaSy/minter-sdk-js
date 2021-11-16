import {toBuffer} from '../../util';
import {TransactionType} from '../internal';
import {Action} from './action';
import {RlpSchemaField} from '../../util/define-properties';
import {BN} from '../../util/external';

/**
 *
 */
export interface MoveStakeActionParams {
    from: string;         // Validator pub key Mp.............
    to: string;           // Validator pub key Mp.............
    coin: number | BN;    // CoinID
    stake: string | BN;   // Pip units
}

/**
 *
 */
export class MoveStakeAction extends Action {
    public static readonly txType = TransactionType.MOVE_STAKE;

    coin: Buffer;
    stake: Buffer;
    from: Buffer;
    to: Buffer;

    constructor(data?: string | Buffer | MoveStakeActionParams) {
        let _data: any = data;

        if (typeof data == 'object' && !Buffer.isBuffer(data)) {
            _data = {
                from : toBuffer(data?.from),
                to   : toBuffer(data?.to),
                coin : new BN(data?.coin),
                stake: new BN(data?.stake),
            };
        }
        throw new Error(
            'Action MoveStake disabled for now. @link https://www.minter.network/docs#move-stake-transaction');
        // TODO: Validation

        super(_data);
    }

    rlpSchema(): RlpSchemaField[] {
        return [
            {
                name  : 'from',
                length: 32,
            },
            {
                name  : 'to',
                length: 32,
            },
            {
                name     : 'coin',
                length   : 4,
                allowLess: true,
            },
            {
                name     : 'stake',
                length   : 32,
                allowLess: true,
            }];
    }
}
