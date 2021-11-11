import {BN} from '../../util';
import {TransactionType} from '../transaction';
import {Action} from './base_action';
import {RlpSchemaField} from '../../util/define-properties';

/**
 *
 */
export interface ReCreateTokenActionParams {
    name: string;                           // Human readable Token Name
    symbol: string;                         // Token Symbol aka Ticker
    initialAmount: string | BN;             // Pip units
    maxSupply?: string | BN;                 // Pip units
    mintable?: boolean;                     //
    burnable?: boolean;                     //
}

/**
 *
 */
export class ReCreateTokenAction extends Action {
    name: Buffer;
    symbol: Buffer;
    initialAmount: Buffer;
    maxSupply?: Buffer;
    mintable?: Buffer;
    burnable?: Buffer;

    /**
     *
     * @param params
     */
    constructor(params: ReCreateTokenActionParams) {
        // Convert params to Buffers
        const _params = {
            name         : Buffer.from(params.name, 'utf8'),
            symbol       : Buffer.from(params.symbol, 'utf8'),
            initialAmount: new BN(params.initialAmount),
            maxSupply    : new BN(params.maxSupply),
            mintable     : params.mintable ? new BN(1) : new BN(0) ,
            burnable     : params.burnable ? new BN(1) : new BN(0) ,
        };


        // TODO: Validation
        // "Maximum supply cannot be more than the initial amount, if the token is not mintable"
        // "Symbol max len 10"
        super(_params);

        this.txType = TransactionType.RECREATE_TOKEN;
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
                name     : 'maxSupply',
                length   : 32,
                allowLess: true,
            }, {
                name     : 'mintable',
                length   : 1,
                allowLess: true,
            }, {
                name     : 'burnable',
                length   : 1,
                allowLess: true,
            }];
    }
}
