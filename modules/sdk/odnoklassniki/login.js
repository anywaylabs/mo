define(['vow', 'config', '../../storage', '../../helpers'], function (vow, config, storage, helpers) {
    return function (scope, appId) {
        appId || (appId = config.ok_auth_client_app_id);

        var deferred = vow.defer(),
            promise = deferred.promise(),
            cachedAuthParams = storage.get('okAuthParams'),
            inAppBrowser;

        if (cachedAuthParams) {
            return vow.resolve(cachedAuthParams);
        }

        inAppBrowser = window.open([
            'https://connect.ok.ru/oauth/authorize',
            '?client_id=' + appId,
            (scope ? '&scope=' + scope.join(';') : ''),
            '&redirect_uri=http://api.ok.ru/blank.html',
            '&layout=m',
            '&response_type=token'
        ].join(''), '_blank', 'location=no');

        inAppBrowser.addEventListener('exit', function () {
            if (!promise.isResolved()) {
                deferred.reject({ error: 'Авторизация отменена' });
            }
        });

        inAppBrowser.addEventListener('loaderror', function (e) {
            deferred.reject({ error: e.message });
        });

        function onLoad (e) {
            if (
                e.url.indexOf('oauth') == -1 &&
                e.url.indexOf('connect.ok.ru') == -1 &&
                e.url.indexOf('api.ok.ru') == -1
            ) {
                deferred.reject({ error: 'Пожалуйста, используйте Одноклассники только для авторизации' });
                return;
            }

            if (e.url.indexOf('http://api.ok.ru/blank.html') != 0) {
                return;
            }

            inAppBrowser.executeScript({ code: 'document.body.innerHTML = "<h2>Добро пожаловать!</h2>Теперь это окно можно закрыть.";' });
            inAppBrowser.insertCSS({ code: 'body { font-family: Helvetica, Arial, sans-serif; font-size: 14px; margin: 20px; text-align: center; }' });

            var query = e.url.split('#')[1];

            if (!query) {
                deferred.reject({ error: 'Некорректный ответ от сервера' });
                return;
            }

            var params = helpers.string.parseQuery(query);

            if (!params || !params.access_token) {
                deferred.reject({ error: 'Не удалось получить данные авторизации' });
                return;
            }

            storage.set('okAuthParams', params);

            deferred.resolve(params);
        }

//        inAppBrowser.addEventListener('loadstart', onLoad);
        inAppBrowser.addEventListener('loadstop', onLoad);

        // Нужно чтобы промис резолвился после закрытия окна.
        var externalDeferred = vow.defer();

        // Workaround for #366.
        promise.always(function () {
            setTimeout(function () {
                inAppBrowser.close();
                externalDeferred.resolve(promise);
            }, 700);
        });

        return externalDeferred.promise();
    }
});