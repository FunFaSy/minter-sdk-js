'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.deepExtend = exports.sum = exports.omit = exports.pluck = exports.flatten = exports.sortBy = exports.filterBy = exports.groupBy = exports.indexBy = exports.keysort = exports.isEmpty = exports.toArray = exports.inArray = exports.arrayConcat = exports.unique = exports.index = exports.clone = exports.extend = exports.values = exports.keys = void 0;
const type_1 = require("./type");
// ----------------------------------------------------------------------------
const keys = Object.keys, values = (x) => ((!type_1.isArray(x)) ? Object.values(x) : x) // don't copy arrays if they're already arrays
, index = (x) => new Set(values(x)), extend = (...args) => Object.assign({}, ...args) // NB: side-effect free
, clone = (x) => (type_1.isArray(x) ? Array.from(x) : extend(x)) // clone arrays or objects
, unique = (x) => Array.from(index(x)), arrayConcat = (a, b) => a.concat(b), inArray = (needle, haystack) => haystack.includes(needle), toArray = (object) => Object.values(object), isEmpty = (object) => {
    if (!object) {
        return true;
    }
    return (Array.isArray(object) ? object : Object.keys(object)).length < 1;
}, keysort = (x, out = {}) => {
    for (const k of keys(x).sort())
        out[k] = x[k];
    return out;
}
/*
          Accepts a map/array of objects and a key name to be used as an index:
          array = [
              { someKey: 'value1', anotherKey: 'anotherValue1' },
              { someKey: 'value2', anotherKey: 'anotherValue2' },
              { someKey: 'value3', anotherKey: 'anotherValue3' },
          ]
          key = 'someKey'
          Returns a map:
          {
              value1: { someKey: 'value1', anotherKey: 'anotherValue1' },
              value2: { someKey: 'value2', anotherKey: 'anotherValue2' },
              value3: { someKey: 'value3', anotherKey: 'anotherValue3' },
          }
      */
, indexBy = (x, k, out = {}) => {
    for (const v of values(x)) {
        if (k in v) {
            out[v[k]] = v;
        }
    }
    return out;
}
/*
            Accepts a map/array of objects and a key name to be used as a grouping parameter:
            array = [
                { someKey: 'value1', anotherKey: 'anotherValue1' },
                { someKey: 'value1', anotherKey: 'anotherValue2' },
                { someKey: 'value3', anotherKey: 'anotherValue3' },
            ]
            key = 'someKey'
            Returns a map:
            {
                value1: [
                    { someKey: 'value1', anotherKey: 'anotherValue1' },
                    { someKey: 'value1', anotherKey: 'anotherValue2' },
                ]
                value3: [
                    { someKey: 'value3', anotherKey: 'anotherValue3' }
                ],
            }
        */
, groupBy = (x, k, out = {}) => {
    for (const v of values(x)) {
        if (k in v) {
            const p = v[k];
            out[p] = out[p] || [];
            out[p].push(v);
        }
    }
    return out;
}
/*
              Accepts a map/array of objects, a key name and a key value to be used as a filter:
              array = [
                  { someKey: 'value1', anotherKey: 'anotherValue1' },
                  { someKey: 'value2', anotherKey: 'anotherValue2' },
                  { someKey: 'value3', anotherKey: 'anotherValue3' },
              ]
              key = 'someKey'
              value = 'value1'
              Returns an array:
              [
                  value1: { someKey: 'value1', anotherKey: 'anotherValue1' },
              ]
          */
, filterBy = (x, k, value = undefined, out = []) => {
    for (const v of values(x)) {
        if (v[k] === value) {
            out.push(v);
        }
    }
    return out;
}, sortBy = (array, key, descending = false, direction = descending ? -1 : 1) => array.sort((a, b) => {
    if (a[key] < b[key]) {
        return -direction;
    }
    else if (a[key] > b[key]) {
        return direction;
    }
    else {
        return 0;
    }
}), flatten = (x, out = []) => {
    for (const v of x) {
        if (type_1.isArray(v)) {
            flatten(v, out);
        }
        else {
            out.push(v);
        }
    }
    return out;
}, pluck = (x, k) => values(x).filter((v) => k in v).map((v) => v[k])
// ------------------------------------------------------------------------
, omit = (x, ...args) => {
    if (!Array.isArray(x)) {
        const out = clone(x);
        for (const k of args) {
            if (type_1.isArray(k)) { // omit (x, ['a', 'b'])
                for (const kk of k) {
                    delete out[kk];
                }
            }
            else {
                delete out[k]; // omit (x, 'a', 'b')
            }
        }
        return out;
    }
    return x;
}, sum = (...xs) => {
    const ns = xs.filter(type_1.isNumber); // leave only numbers
    return (ns.length > 0) ? ns.reduce((a, b) => a + b, 0) : undefined;
}, deepExtend = (...xs) => {
    let out = undefined;
    for (const x of xs) {
        if (type_1.isDictionary(x)) {
            if (!type_1.isDictionary(out)) {
                out = {};
            }
            for (const k in x) {
                out[k] = deepExtend(out[k], x[k]);
            }
        }
        else {
            out = x;
        }
    }
    return out;
};
exports.keys = keys;
exports.values = values;
exports.index = index;
exports.extend = extend;
exports.clone = clone;
exports.unique = unique;
exports.arrayConcat = arrayConcat;
exports.inArray = inArray;
exports.toArray = toArray;
exports.isEmpty = isEmpty;
exports.keysort = keysort;
exports.indexBy = indexBy;
exports.groupBy = groupBy;
exports.filterBy = filterBy;
exports.sortBy = sortBy;
exports.flatten = flatten;
exports.pluck = pluck;
exports.omit = omit;
exports.sum = sum;
exports.deepExtend = deepExtend;
