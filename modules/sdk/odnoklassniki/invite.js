define([
    'lodash', 'vow', 'config', 'md5',
    '../../popup', '../../storage',
    '../../env',
    '../odnoklassniki/login'
], function (_, vow, config, md5, popup, storage, env, login) {
    function invite () {
        if (env.standalone) {
            var appId = config.ok_auth_client_app_id,
                inAppBrowser;

            function showList (params) {
                var deferred = vow.defer();

                inAppBrowser = window.open([
                    'http://connect.ok.ru/dk',
                    '?st.cmd=WidgetSuggest',
                    '&st.app=' + appId,
                    '&st.signature=' + md5(params.session_secret_key)
                ].join(''), '_blank', 'location=no');

                inAppBrowser.addEventListener('exit', function () {
                    deferred.resolve();
                });

                // Иногда возникает непонятная ошибка NSURLErrorDomain error -999, которая не мешает работе.
//                inAppBrowser.addEventListener('loaderror', function (err) {
//                    deferred.reject({ error: err.message });
//                });

                return deferred.promise();
            }

            return login()
                .then(showList)
                .then(function () { popup.show('Теперь ждём ваших друзей!', { type: 'success' }); })
                .fail(popup.show)
                .always(function () { inAppBrowser && inAppBrowser.close(); });
        }

        return null;
    }

    return invite;
});