define([
    'jquery',
    './jqm',
    'config'
], function ($, $mobile, config) {
    var userAgent = navigator.userAgent,
        envParam = location && location.search.match(/env=([\w\d\-\_]+)/),
        browser = {
            ie: userAgent.indexOf('MSIE ') > -1 || userAgent.indexOf('Trident/') > -1,
            mozilla: userAgent.toLowerCase().indexOf('firefox') > -1
        },
        env = {
            browser:            browser,
            windows:            navigator.appVersion.indexOf('Win') != -1,
            iOS:                !!userAgent.match(/iPhone|iPod|iPad/),
            iPad:               !!userAgent.match(/iPad/),
            android:            !!userAgent.match(/android/i),
            standalone:         envParam && envParam[1] == 'app-standalone',
            phonegap:           envParam && envParam[1] == 'app-phonegap',
            vkontakte:          envParam && envParam[1] == 'app-vkontakte',
            facebook:           envParam && envParam[1] == 'app-facebook',
            odnoklassniki:      envParam && envParam[1] == 'app-odnoklassniki',
            touch:              $mobile.support.touch,
            devicePixelRatio:   window.devicePixelRatio || 1,
            device:             {}
        };

    env.standalone = env.standalone || env.phonegap;
    env.webApp = !env.iOS && !env.android;

    if (env.vkontakte) {
        env.platform = 'vkontakte';
    } else if (env.facebook) {
        env.platform = 'facebook';
    } else if (env.odnoklassniki) {
        env.platform = 'odnoklassniki';
    } else if (env.standalone && env.iOS) {
        env.platform = 'ios';
    } else if (env.standalone && env.android) {
        env.platform = 'android';
    }

    env.supports = {
        webworkers: typeof Worker != 'undefined',
        hd: env.devicePixelRatio >= 1,
        statusBarOverlay: env.phonegap && (env.iOS || (env.android && typeof statusbarTransparent == 'object'))
    };

    document.addEventListener('deviceready', function () {
        if (typeof device == 'object') {
            env.device = device;
        }
    }, false);

    // Workaround for #196
    if (env.touch) {
        proveTouchSupport();
    }

    if (!navigator.notification) {
        navigator.notification = {
            alert: function (msg, title) {
                alert((title ? (title + ': ') : '') + msg);
            },
            confirm: function (msg, callback) {
                confirm(msg) && callback();
            }
        }
    }

    function proveTouchSupport () {
        var touchstartFired = false;

        $(document).one('touchstart click', '*', function (e) {
            if (e.type == 'touchstart') {
                touchstartFired = true;
            } if (e.type == 'click') {
                env.touch = touchstartFired;
            }
        });
    }

    return env;
});