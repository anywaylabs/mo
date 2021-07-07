define([
    'lodash',
    'config'
], function (_, config) {
    function noop () {}

    return {
        init: noop,
        setParams: noop,
        hit: noop,
        reachGoal: noop
    }
});
