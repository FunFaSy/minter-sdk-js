"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTokenAction = void 0;
const util_1 = require("../../util");
const internal_1 = require("../internal");
const action_1 = require("./action");
/**
 *
 */
class CreateTokenAction extends action_1.Action {
    constructor(data) {
        let _data = data;
        if (typeof data == 'object' && !Buffer.isBuffer(data)) {
            _data = {
                name: Buffer.from(data.name, 'utf8'),
                symbol: Buffer.from(data.symbol, 'utf8'),
                initialAmount: new util_1.BN(data.initialAmount),
                maxSupply: new util_1.BN(data.maxSupply),
                mintable: data.mintable ? new util_1.BN(1) : new util_1.BN(0),
                burnable: data.burnable ? new util_1.BN(1) : new util_1.BN(0),
            };
        }
        // TODO: Validation
        // "Maximum supply cannot be more than the initial amount, if the token is not mintable"
        // "Symbol max len 10"
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
exports.CreateTokenAction = CreateTokenAction;
CreateTokenAction.txType = internal_1.TransactionType.CREATE_TOKEN;
