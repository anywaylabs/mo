define([
    'lodash',
    './events',
    './analytics/yametrika'
], function (_, globalEvents, analyticsSdk) {
    function init (currentUser) {
        analyticsSdk.init && analyticsSdk.init(currentUser.getAnalyticsParams());

        globalEvents.on('auth:login auth:logout', function () {
            setParams(currentUser.getAnalyticsParams());
        });
    }

    function hitModal (name, options) {
        analyticsSdk.hit('#modal-' + name, _.extend({
            title: 'MODAL ' + name
        }, options));
    }

    function setParams (params) {
        analyticsSdk.setParams && analyticsSdk.setParams(params);
    }

    return {
        init: init,
        hit: analyticsSdk.hit,
        hitModal: hitModal,
        reachGoal: analyticsSdk.reachGoal
    };
});