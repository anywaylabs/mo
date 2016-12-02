define([
    'vow',
    './events', './state', './connect', './storage',
    './remote/singletons/currentUser'
], function (vow, events, state, connect, storage, currentUser) {
    function perform (token) {
        if (!token) {
            var tokenMatch = location.search.match(/token=([\w\d\=\-]+)/i);
            token = tokenMatch && tokenMatch[1] || null;
        }

        if (!token) {
            token = storage.get('authToken');
        }

        if (token) {
            state.authToken = token;
        } else {
            var autoLoginUserIdMatch = location.search.match(/auto_login_user_id=(\d+)/);
            state.autoLoginUserId = autoLoginUserIdMatch && autoLoginUserIdMatch[1] || null;
        }

        var result  = null,
            promise = connect.get('/auth').then(function (data) {
                result = data.result;

                if (!result.token) {
                    return vow.reject({ error: 'Не удалось получить токен' });
                }

                setToken(result.token);

                return currentUser.reload();
            }).then(function (user) {
                state.currentUserId = user.properties.id;

                events.trigger('auth:login', result);

                return result;
            });

        promise.fail(function () {
            setToken(null);
        });

        return promise;
    }

    function clear () {
        setToken(null);
        currentUser.reset();
        events.trigger('auth:logout');
    }

    function setToken (token) {
        if (token) {
            state.authToken = token;
            storage.set('authToken', token);
        } else {
            storage.clear('authToken');
            state.reset();
        }
    }

    return {
        perform: perform,
        clear: clear
    }
});