import {includes} from 'lodash';

const GENERATORS = ['app'];

export default function (target, params) {
    if (includes(GENERATORS, target)) {
        const generate = require(`./${target}`).default;
        generate(params);
    }
};