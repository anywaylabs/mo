define([
    'vow', './socket.io',
    'config',
    './storage',
    './EventManager'
], function (vow, io, config, storage, EventManager) {
    var MAX_TRIES = 3;

    var providers = {},
        connected = false,
        send = null,
        events = new EventManager(),
        disconnect = function () {},
        tries = 0;

    providers['socket.io'] = function (token) {
        var socket, manager = null;

        disconnect = function () {
            connected = false;

            if (socket) {
                socket.off();
                manager.off('reconnecting');
                socket.disconnect();
                events.trigger('disconnect');
                socket = manager = null;
            }
        };

        return new vow.Promise(function (resolve, reject) {
            if (!connected) {
                var query = 'token=' + encodeURIComponent(token);

                if (storage.get('deviceToken')) {
                    query += '&device_token=' + encodeURIComponent(storage.get('deviceToken'));
                }

                socket = io(config.server_url_fast, { forceNew: true, query: query });
                socket.connect();
                manager = socket.io;

                manager.on('reconnecting', function (number) {
//                    tries = number;

                    if (config.debug) {
                        console.log('PUSH reconnecting', tries);
                    }

                    if (tries == MAX_TRIES) {
                        connected = false;
                        events.trigger('disconnect');
                        reject('cannot reconnect');
                    }

                    tries++;
                });

                socket.on('connect', function () {
                    var wasConnected = connected;

                    connected = true;
                    tries = 0;

                    resolve(true);

                    events.trigger(wasConnected ? 'reconnect' : 'connect');
                });

                socket.on('message', function (data) {
                    if (config.debug) {
                        console.log('SOCKET EVENT ' + data.event + ': ' + JSON.stringify(data.params));
                    }

                    events.trigger(data.event, data.params);
                });

                socket.on('error', function (e) {
                    var targetSocket = this;

                    if (targetSocket != socket) {
                        return;
                    }

                    socket.disconnect();

                    setTimeout(function () {
                        if (targetSocket != socket) {
                            return;
                        }

                        socket.connect();
                    }, 1000);
                });

                send = function (url, params, callback) {
                    if (callback) {
                        socket.emit('message', { url: url, params: params }, callback);
                    } else {
                        socket.emit('message', { url: url, params: params });
                    }
                };
            }
        });
    };

    return {
        connect: function (token) {
            var method = 'socket.io',
                connect = providers[method](token);

            if (config.debug) {
                connect.then(function () {
                    console.log('PUSH соединение установлено.');
                });
            }

            return connect;
        },

        disconnect: function () {
            disconnect();
        },

        isConnected: function () {
            return connected;
        },

        events: events,

        send: function (url, params, waitResponse) {
            return new vow.Promise(function (resolve, reject) {
                if (!connected) {
                    reject('Push.send: Отсутствует соединение.');
                    return;
                }

                if (!send) {
                    reject('Push.send: Отсутствует метод push в сторону сервера.');
                    return;
                }

                if (waitResponse) {
                    send(url, params, resolve);
                } else {
                    send(url, params);
                    resolve({ result: true });
                }
            }).timeout(5000);
        }
    };
});