import {includes} from 'lodash';

const GENERATORS = ['app', 'page'];

export default function (target, params) {
    if (includes(GENERATORS, target)) {
        const generate = require(`./${target}`).default;
        generate(params);
    } else {
        console.error(`Unknown generator "${target}"`);
    }
};