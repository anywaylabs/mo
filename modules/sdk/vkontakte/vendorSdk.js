define([
    'vow', 'config'
], function (vow, config) {
    var inited = false,
        deferred = vow.defer(),
        promise = deferred.promise();

    function init () {
        require(['vkontakte.sdk'], function (VK) {
            VK.init(function() {
                inited = true;
                deferred.resolve(VK);
            }, function (err) {
                deferred.reject(err);
            }, config.vkontakte_sdk_version);
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