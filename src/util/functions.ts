'use strict';
import {unCamelCase} from './functions/string';

/*  ------------------------------------------------------------------------ */

const unCamelCasePropertyNames = x => {
    for (const k in x) x[unCamelCase(k)] = x[k]; // camel_case_method = camelCaseMethod
    return x;
};

const fn = unCamelCasePropertyNames(Object.assign({}

    , import ('./functions/string')
    , import ('./functions/type')
    , import ('./functions/time')
));

export default fn;

