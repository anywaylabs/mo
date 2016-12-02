import {includes} from 'lodash';

const GENERATORS = ['app'];

export default function (target, params) {
    if (includes(GENERATORS, target)) {
        const generate = require(`./${target}/generate`).default;
        generate(params);
    }
};