define([
    'config',
    'jquery', './jqm', 'vow',
    './connect', './pages', './music', './views/layout',
    './bindLinks',  './env', './media'
], function (
    config,
    $, $mobile, vow,
    connect, pages, music, layout,
    bindLinks, env, media
) {
    if (config.debug) {
        vow.debug = true;
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

    return function () {
        return ready().then(function () {
            pages.init();
            bindLinks();
            layout.init();
            connect.init();
            media.init();
            music.init();
        });
    };
});