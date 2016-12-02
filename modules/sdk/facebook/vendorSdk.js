define([
    'vow', 'config', '../../env'
], function (vow, config, env) {
    var inited = false,
        deferred = vow.defer(),
        promise = deferred.promise();

    function init () {
        if (!env.webApp) {
            inited = true;
            deferred.resolve();

            return;
        }

        if (typeof cordova == 'undefined') {
            window.cordova = { platformId: 'browser' };
        }

        $(document.body).append('<div id="fb-root"></div>');

        require(['facebook-connect'], function () {
            facebookConnectPlugin.browserInit(config.fb_app_id);
            inited = true;
            deferred.resolve();
        }, function (err) {
            deferred.reject(err);
        });
    }

    return {
        promise: function () {
            if (!inited) {
                init();
            }

            return promise;
        }
    }
});