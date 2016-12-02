define(['./storage', './env'], function (storage, env) {
    function exec (action, args) {
        if (!env.phonegap || typeof StatusBar == 'undefined') {
            return;
        }

        StatusBar[action].apply(this, args);
    }

    return {
        show: function () { exec('show'); },
        hide: function () { exec('hide'); },
        light: function () { exec('styleLightContent'); },
        dark: function () { exec('styleDefault'); },
        overlaysWebView: function () {
            exec('overlaysWebView', arguments);

            if (typeof statusbarTransparent == 'object') {
                statusbarTransparent.enable();
                exec('hide');
                setTimeout(function () { exec('show'); }, 1500);
            }
        }
    };
});