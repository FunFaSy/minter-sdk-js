"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultiSendAction = void 0;
const transaction_1 = require("../transaction");
const action_1 = require("./action");
/**
 *
 */
class MultiSendAction extends action_1.Action {
    constructor(params) {
        // Convert params to Buffers
        const _params = {
            list: params.list, // Pass values through to nonBinaryArrayTransform encoder function.
        };
        super(_params);
    }
    rlpSchema() {
        return [
            {
                name: 'list',
                allowZero: false,
                default: Buffer.from([]),
                allowNonBinaryArray: true,
                nonBinaryArrayTransform(action) {
                    return action.raw;
                },
            },
        ];
    }
}
exports.MultiSendAction = MultiSendAction;
MultiSendAction.txType = transaction_1.TransactionType.MULTISEND;
