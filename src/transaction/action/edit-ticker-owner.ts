import {TransactionType} from '../transaction';
import {Action} from './base_action';
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

        this.txType = TransactionType.EDIT_TICKER_OWNER;
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
