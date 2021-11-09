"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.base_encode = exports.base_decode = exports.baseDecode = exports.baseEncode = void 0;
const encode_1 = require("./encode");
const external_1 = require("../external");
const baseEncode = (value) => {
    if (typeof (value) === 'string') {
        value = Buffer.from(value, 'utf-8');
    }
    return external_1.bs58check.encode(value);
};
exports.baseEncode = baseEncode;
exports.base_encode = exports.baseEncode;
const baseDecode = (value) => {
    return encode_1.toBuffer(external_1.bs58check.decode(value));
};
exports.baseDecode = baseDecode;
exports.base_decode = exports.baseDecode;
