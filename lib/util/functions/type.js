'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeStringUpper2 = exports.safeStringLower2 = exports.safeString2 = exports.safeValue2 = exports.safeTimestamp2 = exports.safeIntegerProduct2 = exports.safeInteger2 = exports.safeFloat2 = exports.safeStringUpper = exports.safeStringLower = exports.safeString = exports.safeValue = exports.safeTimestamp = exports.safeIntegerProduct = exports.safeInteger = exports.safeFloat = exports.asInteger = exports.asFloat = exports.prop = exports.hasProps = exports.isValidUrl = exports.isValidMnemonic = exports.isDictionary = exports.isHexString = exports.isStringCoercible = exports.isString = exports.isObject = exports.isBuffer = exports.isArray = exports.isInteger = exports.isNumber = void 0;
/*  ------------------------------------------------------------------------ */
const external_1 = require("../external");
const isNumber = Number.isFinite, isInteger = Number.isInteger, isArray = Array.isArray, isBuffer = Buffer.isBuffer, hasProps = o => ((o !== undefined) && (o !== null)), isString = s => (typeof s === 'string'), isObject = o => ((o !== null) && (typeof o === 'object')), isRegExp = o => (o instanceof RegExp), isDictionary = o => (isObject(o) && (Object.getPrototypeOf(o) === Object.prototype) && !isArray(o) &&
    !isRegExp(o)), isStringCoercible = x => ((hasProps(x) && x.toString) || isNumber(x)), isHexString = (value, length) => {
    if (typeof value !== 'string' || !value.match(/^0x[0-9A-Fa-f]*$/))
        return false;
    if (length && value.length !== 2 + 2 * length)
        return false;
    return true;
}, isValidUrl = (url) => {
    try {
        new URL(url);
    }
    catch (e) {
        return false;
    }
    return true;
}, isValidMnemonic = (mnemonic) => {
    return typeof mnemonic === 'string' && mnemonic.trim().split(/\s+/g).length >= 12 &&
        external_1.bip39.validateMnemonic(mnemonic);
};
exports.isNumber = isNumber;
exports.isInteger = isInteger;
exports.isArray = isArray;
exports.isBuffer = isBuffer;
exports.hasProps = hasProps;
exports.isString = isString;
exports.isObject = isObject;
exports.isDictionary = isDictionary;
exports.isStringCoercible = isStringCoercible;
exports.isHexString = isHexString;
exports.isValidUrl = isValidUrl;
exports.isValidMnemonic = isValidMnemonic;
/*  .............................................   */
const prop = (o, k) => (isObject(o) ? o[k] : undefined), prop2 = (o, k1, k2) => (!isObject(o) ? undefined : (((k1 in o) && (o[k1] !== null)) ? o[k1] : o[k2]));
exports.prop = prop;
/*  .............................................   */
const asFloat = x => ((isNumber(x) || isString(x)) ? parseFloat(x) : NaN), asInteger = x => ((isNumber(x) || isString(x)) ? parseInt(x, 10) : NaN);
exports.asFloat = asFloat;
exports.asInteger = asInteger;
const safeFloat = (o, k, $default, n = asFloat(prop(o, k))) => (isNumber(n) ? n : $default), safeInteger = (o, k, $default, n = asInteger(prop(o, k))) => (isNumber(n) ? n : $default), safeIntegerProduct = (o, k, $factor, $default, n = asInteger(prop(o, k))) => (isNumber(n) ? parseInt(String(n * $factor)) : $default), safeTimestamp = (o, k, $default, n = asFloat(prop(o, k))) => (isNumber(n)
    ? parseInt(String(n * 1000))
    : $default), safeValue = (o, k, $default, x = prop(o, k)) => (hasProps(x) ? x : $default), safeString = (o, k, $default, x = prop(o, k)) => (isStringCoercible(x) ? String(x) : $default), safeStringLower = (o, k, $default, x = prop(o, k)) => (isStringCoercible(x)
    ? String(x).toLowerCase()
    : $default), safeStringUpper = (o, k, $default, x = prop(o, k)) => (isStringCoercible(x)
    ? String(x).toUpperCase()
    : $default)
// not using safeFloats with an array argument as we're trying to save some cycles here
// we're not using safeFloat3 either because those cases are too rare to deserve their own optimization
, safeFloat2 = (o, k1, k2, $default, n = asFloat(prop2(o, k1, k2))) => (isNumber(n) ? n : $default), safeInteger2 = (o, k1, k2, $default, n = asInteger(prop2(o, k1, k2))) => (isNumber(n) ? n : $default), safeIntegerProduct2 = (o, k1, k2, $factor, $default, n = asInteger(prop2(o, k1, k2))) => (isNumber(n) ? parseInt(String(n * $factor)) : $default), safeTimestamp2 = (o, k1, k2, $default, n = asFloat(prop2(o, k1, k2))) => (isNumber(n) ? parseInt(String(n * 1000)) : $default), safeValue2 = (o, k1, k2, $default, x = prop2(o, k1, k2)) => (hasProps(x) ? x : $default), safeString2 = (o, k1, k2, $default, x = prop2(o, k1, k2)) => (isStringCoercible(x) ? String(x) : $default), safeStringLower2 = (o, k1, k2, $default, x = prop2(o, k1, k2)) => (isStringCoercible(x) ? String(x).
    toLowerCase() : $default), safeStringUpper2 = (o, k1, k2, $default, x = prop2(o, k1, k2)) => (isStringCoercible(x) ? String(x).
    toUpperCase() : $default);
exports.safeFloat = safeFloat;
exports.safeInteger = safeInteger;
exports.safeIntegerProduct = safeIntegerProduct;
exports.safeTimestamp = safeTimestamp;
exports.safeValue = safeValue;
exports.safeString = safeString;
exports.safeStringLower = safeStringLower;
exports.safeStringUpper = safeStringUpper;
exports.safeFloat2 = safeFloat2;
exports.safeInteger2 = safeInteger2;
exports.safeIntegerProduct2 = safeIntegerProduct2;
exports.safeTimestamp2 = safeTimestamp2;
exports.safeValue2 = safeValue2;
exports.safeString2 = safeString2;
exports.safeStringLower2 = safeStringLower2;
exports.safeStringUpper2 = safeStringUpper2;
