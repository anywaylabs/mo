define([
    'config',
    'jquery', './jqm', 'vow',
    './connect', './pages', './events', './music', './views/layout',
    './bindLinks',  './env', './media'
], function (
    config,
    $, $mobile, vow,
    connect, pages, events, music, layout,
    bindLinks, env, media
) {
    if (config.debug) {
        vow.debug = true;
    }

    if (window.cordova && !window.cordova.plugins) {
        window.cordova.plugins = {};
    }

    function ready () {
        var deferred = vow.defer(),
            deviceReady = !env.phonegap;

        if (!deviceReady) {
            // Doesn't work with `$(document).on('deviceready', ..)`. No idea why.
            document.addEventListener('deviceready', function () {
                deviceReady = true;
                checkReady();
            }, false);
        }

        $(document).on('ready mobileinit', checkReady);

        function checkReady() {
            if ($.isReady && deviceReady && typeof $mobile != 'undefined') {
                deferred.resolve();
            }
        }

        checkReady();

        return deferred.promise();
    }

    function setupPauseObserver () {
        $(document).on({
            pause: function () {
                events.trigger('apppause');
            },

            resume: function () {
                events.trigger('appresume');
            }
        });
    }

    return function (params) {
        params || (params = {});
        return ready().then(function () {
            pages.init();
            bindLinks();
            layout.init();
            (params.connect !== false) && connect.init();
            media.init();
            (params.music !== false) && music.init();
            setupPauseObserver()
        });
    };
});
