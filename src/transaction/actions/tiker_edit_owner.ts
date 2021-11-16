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
    constructor(data?: string | Buffer | EditTickerOwnerActionParams) {
        let _data: any = data;

        if (typeof data == 'object' && !Buffer.isBuffer(data)) {
            _data = {
                symbol  : Buffer.from(data.symbol, 'utf8'),
                newOwner: toBuffer(data.newOwner),
            };
        }
        // TODO: Validation
        // Ticker symbol (for example, BTC). Must be unique, alphabetic, uppercase, and 3 to 10 symbols long.
        super(_data);
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
