"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Provider = void 0;
/** @hidden (@link https://github.com/MinterTeam/node-grpc-gateway/blob/master/api.proto)*/
class Provider {
}
exports.Provider = Provider;
/** @hidden */
// export function getTransactionLastResult(txResult: FinalExecutionOutcome): any {
//     if (typeof txResult.status === 'object' && typeof txResult.status.SuccessValue === 'string') {
//         const value = Buffer.from(txResult.status.SuccessValue, 'base64').toString();
//         try {
//             return JSON.parse(value);
//         }
//         catch (e) {
//             return value;
//         }
//     }
//     return null;
// }
