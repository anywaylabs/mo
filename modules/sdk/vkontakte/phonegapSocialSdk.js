define([
    'vow', 'config'
], function (vow, config) {
    var inited = false,
        deferred = vow.defer(),
        promise = deferred.promise();

    function init () {
        if (typeof SocialVk == 'undefined') {
            deferred.reject('Plugin is undefined');
            return;
        }

        SocialVk.init(config.vk_standalone_app_id.toString(), function () {
            deferred.resolve(SocialVk);
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