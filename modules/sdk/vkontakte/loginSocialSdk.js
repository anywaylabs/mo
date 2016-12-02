define([
    'vow',
    '../../storage',
    '../vkontakte/phonegapSocialSdk'
], function (vow, storage, phonegapSocialSdk) {
    return function (scope, tokenReset) {
        scope || (scope = ['friends']);

        var cachedAuthParams = storage.get('vkAuthParams');

        if (cachedAuthParams) {
            return vow.resolve(cachedAuthParams);
        }

        return phonegapSocialSdk.promise()
            .then(function (SocialSdk) {
                return new vow.Promise(function (resolve, reject) {
                    function login () {
                        SocialSdk.login(scope, resolve, reject);
                    }

                    if (tokenReset) {
                        SocialSdk.logout(login, reject);
                    } else {
                        login();
                    }
                });
            })
            .then(function (params) {
                if (typeof params == 'string') {
                    try {
                        params = JSON.parse(params);
                    } catch (err) {}
                }

                if (!params || !params.token) {
                    return vow.reject({ error: 'Не удалось получить данные авторизации' });
                }

                params = { access_token: params.token };

                storage.set('vkAuthParams', params);

                return params;
            });
    }
});