define([
    'lodash', 'vow', 'config',
    '../../modal', '../../popup', '../../loader',
    '../../env',
    '../vkontakte/login',
    '../vkontakte/remoteApi',
    '../vkontakte/vendorSdk'
], function (_, vow, config, modal, popup, loader, env, login, remoteApi, vendorSdk) {
    var cachedFriends;

    function invite (followings) {
        if (env.vkontakte) {
            return vendorSdk.promise().then(function (VK) {
                VK.callMethod('showInviteBox');
            });
        }

        if (env.standalone) {
            loader.show();

            var repeated = false;

            function tryLogin () {
                return login(['friends'], {}.tokenReset = !!repeated);
            }

            function getFriends (params) {
                return remoteApi('friends.get', {
                    fields: 'photo_200',
                    order: 'hints',
                    access_token: params.access_token
                }, config.vk_standalone_app_id).fail(function (err) {
                    if (!repeated && err.tokenReset) {
                        repeated = true;
                        // Повторяем запрос со сброшенным токеном.
                        return tryLogin().then(getFriends);
                    }

                    return vow.reject(err);
                });
            }

            return tryLogin()
                .then(getFriends)
                .then(filterFriends(followings))
                .then(function (res) {
                    loader.hide();
                    return res;
                }, function (err) {
                    loader.hide();
                    return vow.reject(err);
                })
                .then(showList)
                .then(function () {
                    popup.show('Теперь ждём ваших друзей!', { type: 'success' });
                }).fail(popup.show)
        }

        return null;
    }
    
    function filterFriends (followings) {
        return function (data) {
            if (!data.result || !data.result.items) {
                return vow.reject({ error: true });
            }

            var vkFriends = data.result.items,
                followingsIds = _.compact(_.map(followings, function (f) { return f.getProviderUid('vkontakte'); }));

            cachedFriends = _.filter(vkFriends, function (friend) {
                return !_.include(followingsIds, friend.id);
            });

            return cachedFriends;
        }
    }

    function showList (friends, value) {
        var INVITE_TEXT = [
                'Пользователь приглашает вас в приложение Mozg.',
                'Мобильная версия: http://mozggame.ru/mobile',
                'Браузерная версия: http://vk.com/play.mozg'
            ].join('\\n');

        var deferred = vow.defer(),
            promise = deferred.promise();

        modal.show('invite', {
            actionChooseFriends: true,
            friends: friends,
            searchValue: value
        }, {
            cancel: function () {
                modal.hide();
                deferred.resolve();
            },
            filter: function (e, data) {
                var value = data.value;

                if (value.length) {
                    var filteredFriends = cachedFriends.filter(function (friend) {
                        return friend.first_name.concat(friend.last_name).toLowerCase().indexOf(value.toLowerCase()) > -1
                    });

                    showList(filteredFriends, value);
                } else {
                    showList(cachedFriends);
                }
            },
            request: function (e, data) {
                var friendDeferred = vow.defer(),
                    inAppBrowser = window.open('http://vk.com/write' + data.friendId, '_blank', 'location=no');

                inAppBrowser.addEventListener('loadstop', function (e) {
                    if (e.url.indexOf('vk.com/write') == -1) {
                        return;
                    }

                    inAppBrowser.addEventListener('loadstart', function () {
                        friendDeferred.resolve();
                    });

                    inAppBrowser.executeScript({ code: [
                        'var txt = document.querySelector("textarea.textfield");',
                        'txt.value = "' + INVITE_TEXT + '"; txt.style.height = txt.scrollHeight + "px"; txt.focus();',
                        'document.getElementById("write_submit").addEventListener("click", function () {',
                        '   setTimeout(function () { location.href = "http://mozggame.ru/close-vk-dialog"; }, 1000);',
                        '})'
                    ].join('') });
                });

                inAppBrowser.addEventListener('exit', function () {
                    friendDeferred.reject({ error: 'Приглашение отменено' });
                });

                inAppBrowser.addEventListener('loaderror', function (err) {
                    friendDeferred.reject({ error: err.message });
                });

                friendDeferred.promise().then(function () {
                    _.find(friends, { id: data.friendId }).requestSent = true;
                    showList(friends);
                    popup.show('Теперь ждём вашего друга!', { type: 'success' });
                })
                    .fail(popup.show)
                    .always(function () {
                        inAppBrowser.close();
                    });
            }
        });

        return promise;
    }

    return invite;
});