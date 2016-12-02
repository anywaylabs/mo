define([
    'lodash', 'vow',
    'config'
], function (_, vow, config) {
    var SHOW_MIN_INTERVAL = 9e4, // 1.5 min.
        SHOW_MAX_DELAY = 5000; // 5 sec.

    var shownAt = null,
        closeCallback = null;

    function init () {
        if (typeof Appodeal == 'undefined') {
            return;
        }

        Appodeal.initializeAdType(config.appodeal_app_key_apple, Appodeal.INTERSTITIAL | Appodeal.VIDEO | Appodeal.REWARDED_VIDEO);

        Appodeal.enableInterstitialCallbacks(true);
        Appodeal.enableVideoCallbacks(true);
        Appodeal.enableRewardedVideoCallbacks(true);
        document.addEventListener('onInterstitialShown', function (data) { onShow('interstitial', data); });
        document.addEventListener('onVideoShown', function (data) { onShow('video', data); });
        document.addEventListener('onRewardedVideoDidPresent', function (data) { onShow('rewardedVideo', data); });
        document.addEventListener('onInterstitialClosed', function (data) { onClose('interstitial', data); });
        document.addEventListener('onVideoClosed', function (data) { onClose('video', data); });
        document.addEventListener('onRewardedVideoWillDismiss', function (data) { onClose('rewardedVideo', data); });
    }

    function show (params, onSuccess, onFail) {
        if (shownAt && (+new Date() - shownAt < SHOW_MIN_INTERVAL)) {
            return;
        }

        shownAt = +new Date();
        closeCallback = onSuccess || null;

        var allowedTypes = [Appodeal.INTERSTITIAL];

        if (params && params.allowVideo) {
            allowedTypes.push(Appodeal.VIDEO);
        }

        if (params && params.allowObtrusive) {
            allowedTypes.push(Appodeal.REWARDED_VIDEO);
        }

        getReady(allowedTypes).then(function (types) {
            Appodeal.show(types);
        }, function (err) {
            shownAt = null;

            if (onFail) {
                onFail(err);
            }
        });
    }
    
    function onShow () {
        if (shownAt && (+new Date() - shownAt > SHOW_MAX_DELAY)) {
            shownAt = null;
            Appodeal.hide();
        }
    }

    function onClose (adType, data) {
        shownAt = null;

        if (closeCallback) {
            closeCallback(adType, data);
            closeCallback = null;
        }
    }

    function getReady (types) {
        return vow.all(_.map(types, function (type) {
            return checkTypePromise(type);
        })).then(function (results) {
            var readyTypes = 0;

            _.each(results, function (result, i) {
                if (result) {
                    readyTypes |= types[i];
                }
            });

            return readyTypes > 0 ? readyTypes : vow.reject('Nothing of types:' + types + ' is ready');
        });
    }

    function checkTypePromise (type) {
        return new vow.Promise(function (resolve, reject) {
            var resolved = false;

            setTimeout(function () {
                if (!resolved) {
                    resolve(false);
                    resolved = true;
                }
            }, 100);

            Appodeal.isReadyForShowWithStyle(type, function (result) {
                resolve(!!result);
                resolved = true;
            });
        })
    }

    return {
        init: init,
        show: show
    }
});