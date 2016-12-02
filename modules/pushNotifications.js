define([
    'vow',
    'config',
    './popup', './storage',
    './env',
    './remote/models/Device'
], function (vow, config, popup, storage, env, Device) {
    var push;

    function init () {
        if (!env.phonegap) {
            return;
        }

        if (!PushNotification || !PushNotification.init) {
            return;
        }

        push = PushNotification.init({
            ios: {
                badge: 'true',
                sound: 'true',
                alert: 'true'
            },
            android: {
                senderID: config.gcm_sender_id
            }
        });

        push.on('registration', function (data) {
            tokenHandler(data.registrationId);
        });

        push.on('notification', function (data) {
            setBadge(data.count);
        });

        push.on('error', errorHandler);
    }

    function setBadge (n) {
        if (!push) {
            return;
        }

        push.setApplicationIconBadgeNumber(function () {}, null, n);
    }

    function tokenHandler (token) {
        if (!token) {
            popup.show({ error: 'Не удалось подключить Push-уведомления' });
            return;
        }

        if (storage.get('deviceToken') == token) {
            return;
        }

        new Device({ token: token, model: env.device.model }).save().then(function () {
            storage.set('deviceToken', token);
        }).fail(function (err) {
            popup.show({ error: err });
        });
    }

    function errorHandler (err) {
        console.error(err);
        popup.show({ error: 'Не удалось настроить Push-уведомления' });
    }

    return {
        init: init,
        setBadge: setBadge
    };
});