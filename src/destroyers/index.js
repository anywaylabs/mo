import {includes} from 'lodash';

const DESTROYERS = ['app', 'page', 'modal'];

export default function (target, params) {
    if (includes(DESTROYERS, target)) {
        const destroy = require(`./${target}`).default;
        destroy(params);
    } else {
        console.error(`Unknown destroyer "${target}"`);
    }
};