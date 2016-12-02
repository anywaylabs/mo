define([
    'lodash', 'jquery', 'vow',
    'config',
    './state', './popup', './modal', './spinner', './events',
    './push'
], function (_, $, vow, config, state, popup, modal, spinner, events, push) {
    var REQUEST_TIMEOUT = 12000;

    var connect = {
            init: init,
    
            get: function (url, params, $source, noSpinner) {
                return xhr(url, params, 'get', $source, noSpinner);
            },
    
            post: function (url, params, $source, noSpinner) {
                return xhr(url, params, 'post', $source, noSpinner);
            },
    
            put: function (url, params, $source, noSpinner) {
                return xhr(url, params, 'put', $source, noSpinner);
            },
    
            delete: function (url, params, $source, noSpinner) {
                return xhr(url, params, 'delete', $source, noSpinner);
            },

            upload: function (url, files, $source, noSpinner) {
                var data = new FormData();

                _.each(files, function (blob, name) {
                    data.append(name, blob, name);
                });

                return xhr(url, data, 'post', $source, noSpinner);
            },
    
            push: sendPush,
            on: setupPushHandler,
            off: clearPushHandler,
            once: setupSinglePushHandler
        };

    function init () {
        $.ajaxSettings.dataType = 'json';

        $('a[data-remote=true]').on('vclick', onRemoteAction);
        $('form[data-remote=true]').on('submit', onRemoteAction);

        events.on({
            'auth:login': setupPushConnection,
            'auth:logout': clearPushConnection
        });
    }

    function onRemoteAction (e) {
        if (e.type == 'submit' && e.isDefaultPrevented()) {
            return false;
        }

        e.preventDefault();

        var $this = $(this),
            method = $this.attr('method') || 'get',
            url = $this.attr('href') || $this.attr('action'),
            params = $this.serialize();

        connect[method](url, params, $this);

        return false;
    }

    function xhr (action, data, method, $source, noSpinner) {
        data = data || {};
        method = method || 'get';

        var internal = !action.match(/https?\:\/\//),
            url = internal ? config.server_url_api + action + '.json' : action,
            dataType = internal ? 'json' : 'jsonp',
            headers = {},
            promise;

        if (internal) {
            if (state.autoLoginUserId && config.auto_login && config.auto_login_key) {
                headers['X-Auto-Login-User-Id'] = state.autoLoginUserId;
                headers['X-Auto-Login-Key'] = config.auto_login_key;
            } else {
                headers['X-Auth-Token'] = state.authToken;
            }
        }

        if (config.debug) {
            var paramsStr = typeof data == 'string' ? data : JSON.stringify(data);
            console.log('' + method.toUpperCase() + ': ' + url + ' ' + paramsStr);
        }

        promise = new vow.Promise(function (resolve, reject) {
            if (!noSpinner) {
                spinner.show();
            }

            $source && $source.trigger('connect:before');

            var params = {
                    url: url,
                    data: data,
                    method: method,
                    dataType: dataType,
                    headers: headers,

                    success: function (params, textStatus, request) {
                        if (!params || params.error || (internal && !params.result)) {
                            var errMsg = params && params.error ?
                                (typeof params.error == 'string' ? params.error : 'Внутренняя ошибка') :
                                'Неизвестная ошибка',
                                error = createError(errMsg, params && params.flash, request);

                            reject(error);
                            $source && $source.trigger('connect:error', error)
                        } else {
                            var result = createResult(internal ? params.result : params, params.flash, request);

                            resolve(result);
                            $source && $source.trigger('connect:success', result);
                        }
                    },

                    error: function (request, textStatus, err) {
                        var error = createError('Не удалось выполнить запрос', null, request);

                        reject(error);
                        $source && $source.trigger('connect:error', error);
                    }
                };

            if (data instanceof FormData) {
                params.cache = false;
                params.contentType = false;
                params.processData = false;
            }

            $.ajax(params);
        });

        if (!(data instanceof FormData)) {
            promise = promise.timeout(REQUEST_TIMEOUT);

            promise.fail(function (err) {
                if (err instanceof vow.TimedOutError) {
                    popup.show({ error: 'Не удалось выполнить запрос' });
                }
            });
        }

        promise.always(function () {
            if (!noSpinner) {
                spinner.hide();
            }


            $source && $source.trigger('connect:complete');
        });

        return promise;
    }

    function setupPushConnection () {
        if (push.isConnected()) {
            return vow.resolve();
        }

        push.events.on({
            connect: onPushConnect,
            disconnect: onPushSuddenDisconnect
        });

        return push.connect(state.authToken);
    }

    function clearPushConnection () {
        push.events.off({
            connect: onPushConnect,
            disconnect: onPushSuddenDisconnect
        });

        push.disconnect();
    }

    function onPushConnect () {
        modal.hide('connection');
    }

    function onPushSuddenDisconnect () {
        modal.show('connection');
    }

    function sendPush (url, params, $source, waitResponse) {
        $source && $source.trigger('connect:before');

        if (config.debug) {
            console.log('PUSH: ' + url + ' ' +
                (typeof params == 'string' ? params : JSON.stringify(params)));
        }

        return new vow.Promise(function (resolve, reject) {
            push.send(url, params, waitResponse).then(function (data) {
                if (!data || data.error || !data.result) {
                    var errMsg = data && data.error ?
                        (typeof data.error == 'string' ? data.error : 'Внутренняя ошибка') :
                        'Неизвестная ошибка';

                    reject(createError(errMsg, data && data.flash, { request: 'PUSH', data: data }));
                } else {
                    resolve(createResult(data.result, data.flash, { request: 'PUSH', data: data }));
                }
                
                if ($source) {
                    $source.trigger('connect:complete');
                    $source.trigger('connect:success');
                }
            }, function (err) {
                reject(createError(err, {}, { request: 'PUSH', error: err }));

                if ($source) {
                    $source.trigger('connect:complete');
                    $source.trigger('connect:error');
                }
            });
        });
    }

    function setupPushHandler (event, callback) {
        push.events.on(event, callback);

        return connect;
    }

    function setupSinglePushHandler (event, callback) {
        push.events.one(event, callback);

        return connect;
    }

    function clearPushHandler (event, callback) {
        push.events.off(event, callback);

        return connect;
    }

    function createResult (result, flash, request) {
        return {
            result: result,
            flash: flash,
            request: request
        };
    }

    function createError (error, flash, request) {
        if (config.debug) {
            console.log('Connection error: ', error);
        }

        return {
            error: error,
            flash: flash,
            request: request
        };
    }

    return connect;
});