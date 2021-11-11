import {toBuffer} from '../../util';
import {TransactionType} from '../transaction';
import {Action} from './base_action';
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
    coin: Buffer;
    stake: Buffer;
    from: Buffer;
    to: Buffer;

    constructor(params: MoveStakeActionParams) {
        // Convert params to Buffers
        const _params = {
            from : toBuffer(params.from),
            to   : toBuffer(params.to),
            coin : new BN(params.coin),
            stake: new BN(params.stake),
        };

        throw new Error('Action MoveStake disabled for now. @link https://www.minter.network/docs#move-stake-transaction');
        // TODO: Validation

        super(_params);

        this.txType = TransactionType.MOVE_STAKE;
    }

    rlpSchema(): RlpSchemaField[] {
        return [
            {
                name: 'from',
                length: 32,
            },
            {
                name: 'to',
                length: 32,
            },
            {
                name: 'coin',
                length: 4,
                allowLess: true,
            },
            {
                name: 'stake',
                length: 32,
                allowLess: true,
            }];
    }
}
