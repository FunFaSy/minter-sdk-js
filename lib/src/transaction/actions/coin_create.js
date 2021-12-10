"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCoinAction = void 0;
const util_1 = require("../../util");
const internal_1 = require("../internal");
const action_1 = require("./action");
/**
 *
 */
class CreateCoinAction extends action_1.Action {
    constructor(data) {
        let _data = data;
        if (typeof data == 'object' && !Buffer.isBuffer(data)) {
            _data = {
                name: Buffer.from(data.name, 'utf8'),
                symbol: Buffer.from(data.symbol, 'utf8'),
                initialAmount: new util_1.BN(data.initialAmount),
                initialReserve: new util_1.BN(data.initialReserve),
                constantReserveRatio: new util_1.BN(data.constantReserveRatio),
                maxSupply: new util_1.BN(data.maxSupply),
            };
        }
        super(_data);
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
CreateCoinAction.txType = internal_1.TransactionType.CREATE_COIN;
