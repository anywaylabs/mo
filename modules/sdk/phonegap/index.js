define([
    '../../env',
    '../../events',
    '../phonegap/purchase',
    '../phonegap/store'
], function (env, events, purchase, store) {
    var sdk = env.iOS ? purchase : store;

    function init () {
        events.on('auth:login', sdk.init);
    }

    return {
        init: init,
        purchase: sdk.purchase
    }
});