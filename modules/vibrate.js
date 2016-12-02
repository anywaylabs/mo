define(['./storage', './env'], function (storage, env) {
    return function (ms) {
        if (typeof ms != 'number') {
            ms = 300;
        }

        if (!storage.get('vibrationEnabled')) {
            return;
        }

        if (!env.phonegap || typeof navigator.vibrate != 'function') {
            return;
        }

        navigator.vibrate(ms);
    }
});