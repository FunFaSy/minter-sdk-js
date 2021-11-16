import {TransactionType} from '../internal';
import {Action} from './action';
import {RlpSchemaField} from '../../util/define-properties';
import {toBuffer} from '../../util';

/**
 *
 */
export interface EditTickerOwnerActionParams {
    newOwner: string;  // Mx.........
    symbol: string;    // Token Symbol aka Ticker
}

/**
 *
 */
export class EditTickerOwnerAction extends Action {
    public static readonly txType = TransactionType.EDIT_TICKER_OWNER;

    symbol: Buffer;
    newOwner: Buffer;

    /**
     *
     * @param params
     */
    constructor(params: EditTickerOwnerActionParams) {
        // Convert params to Buffers
        const _params = {
            symbol  : Buffer.from(params.symbol, 'utf8'),
            newOwner: toBuffer(params.newOwner),
        };

        // TODO: Validation
        // Ticker symbol (for example, BTC). Must be unique, alphabetic, uppercase, and 3 to 10 symbols long.
        super(_params);
    }

    /**
     *
     */
    rlpSchema(): RlpSchemaField[] {
        return [
            {
                name  : 'symbol',
                length: 10,
            }, {
                name  : 'newOwner',
                length: 20,
            }];
    }
}
