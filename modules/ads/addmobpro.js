define([
    'config',
    'vow'
], function (config, vow) {
    var MEDIA_ID = 'ca-app-pub-1407244122993966/5356623736';
    //var MEDIA_ID = 'ca-app-pub-1407244122993966/6135352937';
    //var MEDIA_ID = 'ca-app-pub-1407244122993966/4519018930';

    var mediaAdCb = null,
        prepareDeferred;

    function init () {
        if (typeof AdMob == 'undefined') {
            return;
        }

        document.addEventListener('onAdFailLoad', function () {
            prepareDeferred.reject();

            prepare();
        });
        
        document.addEventListener('onAdLoaded', function () {
            prepareDeferred.resolve();
        });

        document.addEventListener('onAdDismiss', prepare);
        document.addEventListener('onAdLeaveApp', prepare);

        prepare();
    }

    function showRewardedMedia (cb) {
        if (typeof AdMob == 'undefined') {
            return;
        }

        prepareDeferred.promise().then(function () {
            AdMob.showInterstitial();

            mediaAdCb = cb;
        });
    }

    function prepare () {
        if (prepareDeferred && !prepareDeferred.promise().isResolved()) {
            return prepareDeferred.promise();
        }

        prepareDeferred = vow.defer();

        AdMob.prepareInterstitial({
            adId: MEDIA_ID,
            autoShow: false
        });
    }

    return {
        init: init,
        showRewardedMedia: showRewardedMedia
    }
});