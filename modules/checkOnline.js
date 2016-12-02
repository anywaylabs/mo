define([
    'lodash', 'vow',
    './connect',
    'sdk/manager'
], function (_, vow, connect, sdkManager) {
    var TIMEOUT = 5, // min
        STATUSES = {
            offline: 0,
            vkontakte: 1,
            fast: 10
        };

    var cache = { /* uid: { status: true, updated: Date }  */ };

    function checkOnline (users) {
        var single = !_.isArray(users);

        if (single) {
            users = [users];
        }

        cleanCache();

        var uids = _.map(users, function (user) { return user.properties.id; });

        return checkCache(uids, users)
            .then(function (check) {
                return checkFast(check).fail(function () { return check });
            })
            .then(function (check) {
                return checkVkontakte(check).fail(function () { return check });
            })
            .then(function () {
                return single ? cache[uids[0]].status : _.pick(cache, uids);
            });
    }

    function cleanCache () {
        cache = _.omit(cache, function (user) { return (new Date()) - user.checked > TIMEOUT * 60 * 1e3; });
    }

    function checkCache (uids, users) {
        updateCache(createListWithStatuses(_.difference(uids, _.keys(cache)), STATUSES['offline']));

        return vow.resolve({
            uids: uids,
            users: users,
            done: areOnline(uids)
        });
    }

    function checkFast (check) {
        if (check.done) {
            return vow.resolve(check);
        }

        return connect.push('/info/online', { uids: _.keys(cache) }, null, true).then(function (data) {
            updateCache(createListWithStatuses(data.result, STATUSES['fast']));

            return _.extend({}, check, { done: areOnline(check.uids) });
        });
    }

    function checkVkontakte (check) {
        var providerUids = _.compact(_.invoke(check.users, 'getProviderUid', 'vkontakte')).join(',');

        if (check.done || !providerUids) {
            return vow.resolve(check);
        }

        return sdkManager.getSdk('vkontakte').remoteApi('users.get', { user_ids: providerUids, fields: 'online' })
            .then(function (data) {
                var onlineProviderUids = _.map(_.where(data.result, { online: 1 }), 'id'),
                    onlineUids = _.map(onlineProviderUids, function (vkUid) {
                        return _.find(check.users, function (user) {
                            return user.getProviderUid('vkontakte') == vkUid;
                        }).properties.id;
                    });

                updateCache(createListWithStatuses(onlineUids, STATUSES['vkontakte']));

                return _.extend({}, check, { done: areOnline(check.uids) });
            });
    }

    function createListWithStatuses (uids, status) {
        return _.zipObject(uids, _.map(uids, function () { return { status: status }; }))
    }

    function updateCache (list) {
        _.each(list, function (user, id) {
            if (!cache[id] || cache[id].status < user.status) {
                cache[id] = {
                    status: user.status || STATUSES['offline'],
                    updated: new Date()
                }
            }
        });
    }

    function areOnline (uids) {
        return !_.any(_.pick(cache, uids), { status: STATUSES['offline'] });
    }

    return checkOnline;
});