define([
    'lodash',
    './connect', './pages', './appeal', './popup', './events',
    'remote/models/Notify', 'remote/singletons/notifies',
    'view/render'
], function (_, connect, pages, appeal, popup, globalEvents, RemoteNotify, remoteNotifies, render) {
    var commonParams = {
            vibrate: true,
            sound: 'award',
            proxy: 'light'
        };

    function init () {
        connect
            .on('notify:match notify:delayed_match', onMatch)
            .on('notify:follow', onFollow)
            .on('notify:award', onAward)
            .on('notify:mailing', onMailing)
            .on('notify:message', onMessage)
            .on('notify:delayed_result', onDelayedResult);
    }
    
    function onMatch (e, params) {
        var notify = new RemoteNotify(params.notify);

        popup.dialog(notify.properties.message, 'Поехали!', 'Не сейчас', commonParams)
            .then(notify.accept, notify.ignore, notify);
    }
    
    function onFollow (e, params) {
        var notify = new RemoteNotify(params.notify);

        if (params.notify.data.in_common) {
            popup.dialog(notify.properties.message, null, null, commonParams)
                .then(notify.ignore, notify);
        } else {
            popup.dialog(notify.properties.message, 'Подружиться!', 'Не сейчас', commonParams)
                .then(notify.accept, notify.ignore, notify);
        }
    }

    function onAward (e, params) {
        var notify = new RemoteNotify(params.notify);

        popup.show(render('components/_award_unlocked', params.notify.data.award), _.extend({
            type: 'award-unlocked',
            hideTimeout: false,
            onHide: function () { notify.delete(); }
        }, commonParams));
    }

    function onMailing (e, params) {
        popup.dialog(params.notify.message, 'Закрыть', null, commonParams);
    }

    function onMessage (e, params) {
        var notify = new RemoteNotify(params.notify),
            talkId = notify.properties.data.talk_id,
            currentPage = pages.getCurrent(),
            inTalk = currentPage == 'talk' && pages.get(currentPage).getTalkId() == talkId;

        if (inTalk) {
            notify.delete();

            return;
        }

        remoteNotifies.getAll(true);

        if (notify.properties.data.unread_count == 1) {
            popup.dialog(notify.properties.message, 'Ответить', 'Не сейчас', commonParams)
                .then(notify.accept, notify);
        }
    }

    function onDelayedResult (e, params) {
        var notify = new RemoteNotify(params.notify);

        popup.dialog(params.notify.message, 'Результаты', 'Закрыть', commonParams)
            .then(notify.accept, notify.ignore, notify);
    }

    return {
        init: init
    }
});