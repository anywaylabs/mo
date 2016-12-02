define([
    'vow',
    '../facebook/vendorSdk'
], function (vow, vendorSdk) {
    return function (scope) {
        return vendorSdk.promise().then(function () {
            var deferred = vow.defer();

            facebookConnectPlugin.login(scope, function (params) {
                if (params.authResponse && params.authResponse.accessToken) {
                    deferred.resolve(params);
                } else {
                    deferred.reject(params);
                }
            }, function (err) {
                deferred.reject({ error: err });
            });

            return deferred.promise();
        });
    };
});