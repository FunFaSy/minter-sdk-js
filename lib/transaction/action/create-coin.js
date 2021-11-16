"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCoinAction = void 0;
const util_1 = require("../../util");
const transaction_1 = require("../transaction");
const base_action_1 = require("./base_action");
/**
 *
 */
class CreateCoinAction extends base_action_1.Action {
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
            initialReserve: new util_1.BN(params.initialReserve),
            constantReserveRatio: new util_1.BN(params.constantReserveRatio),
            maxSupply: new util_1.BN(params.maxSupply),
        };
        super(_params);
        this.txType = transaction_1.TransactionType.CREATE_COIN;
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
                name: 'initialReserve',
                length: 32,
                allowLess: true,
            }, {
                name: 'constantReserveRatio',
                length: 1,
                allowLess: true,
            }, {
                name: 'maxSupply',
                length: 32,
                allowLess: true,
            }
        ];
    }
}
exports.CreateCoinAction = CreateCoinAction;