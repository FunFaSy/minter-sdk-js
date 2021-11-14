"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReCreateTokenAction = void 0;
const util_1 = require("../../util");
const transaction_1 = require("../transaction");
const action_1 = require("./action");
/**
 *
 */
class ReCreateTokenAction extends action_1.Action {
    /**
     *
     * @param params
     */
    constructor(params) {
        // Convert params to Buffers
        const _params = {
            name: Buffer.from(params.name, 'utf8'),
            symbol: Buffer.from(params.symbol, 'utf8'),
            initialAmount: new util_1.BN(params.initialAmount),
            maxSupply: new util_1.BN(params.maxSupply),
            mintable: params.mintable ? new util_1.BN(1) : new util_1.BN(0),
            burnable: params.burnable ? new util_1.BN(1) : new util_1.BN(0),
        };
        // TODO: Validation
        // "Maximum supply cannot be more than the initial amount, if the token is not mintable"
        // "Symbol max len 10"
        super(_params);
        this.txType = transaction_1.TransactionType.RECREATE_TOKEN;
    }
    /**
     *
     */
    rlpSchema() {
        return [
            {
                name: 'name',
                default: Buffer.from([]),
            }, {
                name: 'symbol',
                length: 10,
            }, {
                name: 'initialAmount',
                length: 32,
                allowLess: true,
            }, {
                name: 'maxSupply',
                length: 32,
                allowLess: true,
            }, {
                name: 'mintable',
                length: 1,
                allowLess: true,
            }, {
                name: 'burnable',
                length: 1,
                allowLess: true,
            }
        ];
    }
}
exports.ReCreateTokenAction = ReCreateTokenAction;
