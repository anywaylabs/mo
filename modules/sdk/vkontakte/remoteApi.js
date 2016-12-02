define([
    'vow',
    'config',
    '../../connect', '../../storage'
], function (vow, config, connect, storage) {
    var URL = 'https://api.vk.com/method/';

    return function (method, params) {
        return connect.get(URL + method, _.extend({
            v: config.vkontakte_sdk_version
        }, params)).then(function (data) {
            data.result = data.result.response;
            return data;
        }).fail(function (err) {
            var json = err && err.request && err.request.responseJSON;
            if (json && json.error && json.error.error_code == 5) {
                storage.clear('vkAuthParams');
                err.tokenReset = true;
            }

            return vow.reject(err);
        });
    }
});