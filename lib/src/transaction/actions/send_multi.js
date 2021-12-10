"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultiSendAction = void 0;
const internal_1 = require("../internal");
const action_1 = require("./action");
const send_1 = require("./send");
/**
 *
 */
class MultiSendAction extends action_1.Action {
    constructor(data) {
        let _data = data;
        if (typeof data == 'object' && !Buffer.isBuffer(data)) {
            _data = {
                list: data?.list || [], // Pass values through to nonBinaryArrayTransform encoder function.
            };
        }
        super(_data);
    }
    rlpSchema() {
        return [
            {
                name: 'list',
                allowZero: false,
                default: Buffer.from([]),
                allowNonBinaryArray: true,
                nonBinaryArrayTransform(action) {
                    // In case transaction restored from string
                    return (action instanceof send_1.SendAction) ? action.raw : action;
                },
            },
        ];
    }
}
exports.MultiSendAction = MultiSendAction;
MultiSendAction.txType = internal_1.TransactionType.MULTISEND;
