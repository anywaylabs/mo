define([
    'lodash', 'vow', '../../popup', '../facebook/vendorSdk'
], function (_, vow, popup, vendorSdk) {
    var INVITE_TEXT = [
        'Пользователь приглашает вас в приложение Mozg.',
        'Мобильная версия: http://mozggame.ru/mobile',
        'Браузерная версия: http://vk.com/play.mozg'
    ].join('\\n');

    return function () {
        return vendorSdk.promise().then(function () {
            var deferred = vow.defer(),
            promise = deferred.promise();

            facebookConnectPlugin.showDialog({
                method: 'apprequests',
                message: INVITE_TEXT,
                actionType: '',
                filters: 'app_non_users'
            }, function (params) {
                if (params && params.to) {
                    deferred.resolve(params);
                } else {
                    deferred.reject({ error: true });
                }
            }, function (err) {
                deferred.reject({ error: err || true });
            });

            promise.then(function () {
                popup.show('Отлично, теперь ждём ваших друзей!', { type: 'success' });
            }, popup.show);

            return promise;
        });
    };
});