"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateMultiSigAction = void 0;
const util_1 = require("../../util");
const transaction_1 = require("../transaction");
const action_1 = require("./action");
/**
 *
 */
class CreateMultiSigAction extends action_1.Action {
    constructor(params) {
        // Convert params to Buffers
        const _params = {
            threshold: new util_1.BN(params.threshold),
            weights: params.weights,
            addresses: params.addresses,
        };
        // TODO: Validation
        // threshold Should be less or equal than Weights Sum
        // weights   Should be greater or equal than threshold
        super(_params);
    }
    rlpSchema() {
        return [
            {
                name: 'threshold',
                allowZero: false,
                // length: 2,
                // allowLess: true,
                default: Buffer.from([]),
            }, {
                name: 'weights',
                allowZero: false,
                allowNonBinaryArray: true,
                nonBinaryArrayTransform(weight) {
                    return util_1.toBuffer(new util_1.BN(weight));
                },
                default: Buffer.from([]),
            }, {
                name: 'addresses',
                allowZero: false,
                allowNonBinaryArray: true,
                nonBinaryArrayTransform(address) {
                    return util_1.toBuffer(address);
                },
                default: Buffer.from([]),
            }
        ];
    }
}
exports.CreateMultiSigAction = CreateMultiSigAction;
CreateMultiSigAction.txType = transaction_1.TransactionType.CREATE_MULTISIG;
