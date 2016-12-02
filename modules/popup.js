define([
    'lodash', 'vow', './views/components/Popup', './vibrate', './playSound'
], function (_, vow, View, vibrate, playSound) {
    var view = null,
        sequence = [],
        isShown = false,
        isHiding = false,
        isFrozen = false,
        frozenTypes = ['dark', 'award-unlocked'],
        hideTimeout = null,
        hideCallback = null;

    function init ($el) {
        view = new View($el);
    }

    function show () {
        var params = castParams(Array.prototype.slice.call(arguments));

        if (isShown || (isFrozen && frozenTypes.indexOf(params.type) >= 0) && !params.force) {
            sequence.push(params);
            return;
        }

        if (hideTimeout) {
            clearTimeout(hideTimeout);
            hideTimeout = null;
        }

        isShown = true;

        hideCallback = params.onHide || null;

        if (typeof params.hideTimeout == 'number') {
            hideTimeout = setTimeout(hide, params.hideTimeout);
        }

        if (!params.modal) {
            view.events.on('click', hide);
        }

        view.build(params);

        if (params.vibrate) {
            vibrate(params.vibrate);
        }

        if (params.sound) {
            playSound(params.sound);
        }
    }

    function hide () {
        if (isHiding) {
            return;
        }

        isHiding = true;

        if (hideTimeout) {
            clearTimeout(hideTimeout);
            hideTimeout = null;
        }

        view.events.off('click', hide);

        view.clear(function () {
            isShown = false;
            isHiding = false;
            hideCallback && hideCallback();

            if (sequence.length) {
                show(sequence.shift());
            }
        });
    }

    function castParams (params) {
        if (typeof params[0] == 'string') {
            params = _.extend({
                content: params[0]
            }, params[1]);
        } else if (params[0] instanceof Error) {
            params = _.extend({
                error: true,
                content: params[0].message
            }, params[1]);
        } else {
            params = _.extend({}, params[0]);
        }

        if (!params.type) {
            params.type = 'error' in params ? 'fail' : 'tip';
        }

        if (!params.content) {
            if (params.msg) {
                params.content = params.msg;
            } else if (!params.proxy) {
                params.content = 'error' in params ? (typeof params.error == 'string' ? params.error : "Ошибка") : "Готово!";
            }
        }

        if (typeof params.hideTimeout == 'undefined') {
            params.hideTimeout = 2000;
        }

        if (!params.pickerType) {
            params.pickerType = 'none';
        }

        if (typeof params.proxy == 'undefined') {
            params.proxy = true;
        }

        return params;
    }

    function blink (proxyType, duration) {
        show({
            proxy: proxyType || 'white',
            hideTimeout: duration || 500
        });
    }

    function bubble (content, params) {
        show(content, _.extend({
            bubble: true,
            hideTimeout: 1000
        }, params));
    }

    function dialog (content, btnOk, btnCancel, params) {
        btnOk || (btnOk = 'OK');

        var deferred = vow.defer(),
            buttons = [];

        buttons.push({
            className: btnCancel ? 'green' : '',
            text: btnOk,
            handlers: { vclick: function () { hide(); deferred.resolve(); } }
        });

        if (btnCancel) {
            buttons.push({
                className: 'red',
                text: btnCancel,
                handlers: { vclick: function () { hide(); deferred.reject(); } }
            });
        }

        show(content, _.extend({
            type: 'dark',
            modal: true,
            buttons: buttons,
            hideTimeout: null
        }, params));

        return deferred.promise();
    }

    function freeze () {
        hide();
        isFrozen = true;
    }

    function unfreeze () {
        isFrozen = false;
        
        if (sequence.length) {
            show(sequence.shift());
        }
    }

    return {
        init: init,
        show: show,
        hide: hide,
        blink: blink,
        bubble: bubble,
        dialog: dialog,
        freeze: freeze,
        unfreeze: unfreeze,
        isShown: function () {
            return isShown;
        }
    }
});