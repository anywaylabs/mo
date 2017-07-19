define(['./storage', './env'], function (storage, env) {
    function isPluginSupported() {
        return env.phonegap && typeof cordova.plugins.Keyboard != 'undefined';
    }

    function exec (action, args) {
        if (!isPluginSupported()) {
            return;
        }

        var Keyboard = cordova.plugins.Keyboard;
        return Keyboard[action].apply(Keyboard, args);
    }

    return {
        show: function () { exec('show', arguments); },
        open: function () { exec('show', arguments); },
        hide: function () { exec('close', arguments); },
        close: function () { exec('close', arguments); },
        disableScroll: function () { exec('disableScroll', arguments); },
        hideKeyboardAccessoryBar: function () { exec('hideKeyboardAccessoryBar', arguments); },
        isPluginSupported
    };
});