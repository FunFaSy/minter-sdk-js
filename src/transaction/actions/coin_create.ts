import {BN} from '../../util';
import {TransactionType} from '../internal';
import {Action} from './action';
import {RlpSchemaField} from '../../util/define-properties';

/**
 *
 */
export interface CreateCoinActionParams {
    name: string;                           // Human readable Coin Name
    symbol: string;                         // Coin Symbol aka Ticker
    initialAmount: string | BN;             // Pip units
    initialReserve: string | BN;            // Pip units
    constantReserveRatio: number | BN;      // Pip units
    maxSupply?: string | BN;                 // Pip units
}

/**
 *
 */
export class CreateCoinAction extends Action {
    public static readonly txType = TransactionType.CREATE_COIN;

    name: Buffer;
    symbol: Buffer;
    initialAmount: Buffer;
    initialReserve: Buffer;
    constantReserveRatio: Buffer;
    maxSupply?: Buffer;

    /**
     *
     * @param params
     */
    constructor(params: CreateCoinActionParams) {
        // Convert params to Buffers
        const _params = {
            name                : Buffer.from(params.name, 'utf8'),
            symbol              : Buffer.from(params.symbol, 'utf8'),
            initialAmount       : new BN(params.initialAmount),
            initialReserve      : new BN(params.initialReserve),
            constantReserveRatio: new BN(params.constantReserveRatio),
            maxSupply           : new BN(params.maxSupply),
        };

        super(_params);
    }

    /**
     *
     */
    rlpSchema(): RlpSchemaField[] {
        return [
            {
                name   : 'name',
                default: Buffer.from([]),
            }, {
                name  : 'symbol',
                length: 10,
            }, {
                name     : 'initialAmount',
                length   : 32,
                allowLess: true,
            }, {
                name     : 'initialReserve',
                length   : 32,
                allowLess: true,
            }, {
                name     : 'constantReserveRatio',
                length   : 1,
                allowLess: true,
            }, {
                name     : 'maxSupply',
                length   : 32,
                allowLess: true,
            }];
    }
}
