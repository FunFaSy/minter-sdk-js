"use strict";
// RPC Entities
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwapAlgoEnum = exports.CandidatesStatusEnum = void 0;
var CandidatesStatusEnum;
(function (CandidatesStatusEnum) {
    CandidatesStatusEnum["ALL"] = "all";
    CandidatesStatusEnum["ON"] = "on";
    CandidatesStatusEnum["OFF"] = "off";
})(CandidatesStatusEnum = exports.CandidatesStatusEnum || (exports.CandidatesStatusEnum = {}));
var SwapAlgoEnum;
(function (SwapAlgoEnum) {
    SwapAlgoEnum["OPTIMAL"] = "optimal";
    SwapAlgoEnum["BANCOR"] = "bancor";
    SwapAlgoEnum["POOL"] = "pool";
})(SwapAlgoEnum = exports.SwapAlgoEnum || (exports.SwapAlgoEnum = {}));
