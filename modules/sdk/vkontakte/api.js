define(['vow', '../vkontakte/vendorSdk'], function (vow, vendorSdk) {
    return function (method, params) {
        var deferred = vow.defer();

        vendorSdk.promise().then(function (VK) {
            VK.api(method, params, function (data) {
                if (!data || !data.response || data.error) {
                    deferred.reject(data && data.error);
                    return;
                }

                deferred.resolve(data.response);
            });
        });

        return deferred.promise();
    }
});