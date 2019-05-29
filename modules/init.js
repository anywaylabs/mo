define([
    'config',
    'jquery', './jqm', 'vow',
    './connect', './pages', './events', './music', './views/layout',
    './bindLinks', './env', './media', './analytics'
], function (
    config,
    $, $mobile, vow,
    connect, pages, events, music, layout,
    bindLinks, env, media, analytics
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

    /**
     * mo initializer
     *
     * @param [options.connect=false] {Boolean}
     * @param [options.media=true] {Boolean}
     * @param [options.music=true] {Boolean}
     * @param [options.soundOnClick=true] {Boolean}
     */
    return function (options) {
        options || (options = {});

        return ready().then(function () {
            pages.init();
            bindLinks();
            layout.init(options);
            if (options.connect === true) {
                connect.init();
            }
            if (options.media !== false) {
                media.init();
                if (options.music !== false) {
                    music.init();
                }
            }
            if (options.analytics) {
                analytics.init(options.analytics);
            }
            setupPauseObserver()
        });
    };
});
