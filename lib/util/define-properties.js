"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const encode_1 = require("./functions/encode");
const external_1 = require("./external");
const _typeof = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol'
    ? function (obj) { return typeof obj; }
    : function (obj) {
        return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype
            ? 'symbol'
            : typeof obj;
    };
/**
 * Defines properties on a `Object`. It make the assumption that underlying data is binary.
 * @param {Object} self the `Object` to define properties on
 * @param {Array} fields an array fields to define. Fields can contain:
 * * `name` - the name of the properties
 * * `length` - the number of bytes the field can have
 * * `allowLess` - if the field can be less than the length
 * * `allowEmpty`
 * * `allowNonBinaryArray` - if the field can be non binary array
 * * `nonBinaryArrayTransform` - function to transform each item of the non binary array
 * @param {*} [data] data to be validated against the definitions
 */
function defineProperties(self, fields, data) {
    self.raw = [];
    self._fields = [];
    // attach the `toJSON`
    self.toJSON = function (label) {
        if (label) {
            const obj = {};
            self._fields.forEach((field) => {
                obj[field] = `0x${self[field].toString('hex')}`;
            });
            return obj;
        }
        return external_1.baToJSON(this.raw);
    };
    self.serialize = function serialize() {
        return external_1.rlp.encode(self.raw);
    };
    self.serializeToString = function serialize() {
        return `0x${self.serialize().toString('hex')}`;
    };
    fields.forEach((field, i) => {
        self._fields.push(field.name);
        function getter() {
            return self.raw[i];
        }
        function setter(v) {
            if (field.allowNonBinaryArray && Array.isArray(v)) {
                if (field.nonBinaryArrayTransform && typeof field.nonBinaryArrayTransform === 'function') {
                    v = v.map((item) => field.nonBinaryArrayTransform(item));
                }
                else {
                    v = v.map((item) => encode_1.toBuffer(item));
                }
                // cast 0x00 to 0x, to represent in RLP as 0x80 instead of 0x00
                v = v.map((item) => {
                    if (item.toString('hex') === '00' /* && !field.allowZero */) {
                        return Buffer.from([]);
                    }
                    return item;
                });
            }
            else {
                v = encode_1.toBuffer(v);
                if (v.toString('hex') === '00' && !field.allowZero) {
                    v = Buffer.from([]);
                }
                if (field.allowLess && field.length > 0) {
                    v = external_1.unpadBuffer(v);
                    external_1.assert(field.length >= v.length, `The field ${field.name} must not have more ${field.length} bytes`);
                }
                else if (!(field.allowZero && v.length === 0) && field.length > 0) {
                    external_1.assert(field.length === v.length, `The field ${field.name} must have byte length of ${field.length}`);
                }
            }
            self.raw[i] = v;
        }
        Object.defineProperty(self, field.name, {
            enumerable: true,
            configurable: true,
            get: getter,
            set: setter,
        });
        if (field.default) {
            self[field.name] = field.default;
        }
        // attach alias
        if (field.alias) {
            Object.defineProperty(self, field.alias, {
                enumerable: false,
                configurable: true,
                set: setter,
                get: getter,
            });
        }
    });
    // if the constuctor is passed data
    if (data) {
        if (typeof data === 'string') {
            data = encode_1.toBuffer(data);
        }
        if (Buffer.isBuffer(data)) {
            data = external_1.rlp.decode(data);
        }
        if (Array.isArray(data)) {
            if (data.length > self._fields.length) {
                throw new Error('wrong number of fields in data');
            }
            // set fields from array
            data.forEach((d, i) => {
                self[self._fields[i]] = d;
            });
        }
        else if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object') {
            const keys = Object.keys(data);
            fields.forEach((field) => {
                if (keys.indexOf(field.name) !== -1)
                    self[field.name] = data[field.name];
                if (keys.indexOf(field.alias) !== -1)
                    self[field.alias] = data[field.alias];
            });
        }
        else {
            throw new Error('invalid data');
        }
    }
}
exports.default = defineProperties;
