"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateMultiSigAction = void 0;
const util_1 = require("../../util");
const internal_1 = require("../internal");
const action_1 = require("./action");
/**
 *
 */
class CreateMultiSigAction extends action_1.Action {
    constructor(data) {
        let _data = data;
        if (typeof data == 'object' && !Buffer.isBuffer(data)) {
            _data = {
                threshold: new util_1.BN(data?.threshold),
                weights: data?.weights.map(w => new util_1.BN(w)),
                addresses: data?.addresses,
            };
        }
        // TODO: Validation
        // threshold Should be less or equal than Weights Sum
        // weights   Should be greater or equal than threshold
        super(_data);
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
CreateMultiSigAction.txType = internal_1.TransactionType.CREATE_MULTISIG;
