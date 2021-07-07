define([
    'lodash',
    './events',
    './analytics/mock'
], function (_, globalEvents, analyticsSdk) {
    function init (getAnalyticsParams) {
        analyticsSdk.init && analyticsSdk.init(getAnalyticsParams());

        globalEvents.on('auth:login auth:logout', function () {
            setParams(getAnalyticsParams());
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
