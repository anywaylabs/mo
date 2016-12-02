define([
    'vow',
    './popup', './modal', './storage', './analytics',
    './ads/appodeal', './ads/appodealAndroid',
    './env',
    'remote/singletons/currentUser'
], function (vow, popup, modal, storage, analytics, appodeal, appodealAndroid, env, currentUser) {
    var MIN_SCORE_FOR_VIDEO = 1e4,
        MIN_SCORE_FOR_OBTRUSIVE = 3e4,
        DISCLAIMER_COUNTER_MAX = 19;
    
    var adsSdk = null;

    function init () {
        if (env.iOS) {
            adsSdk = appodeal;
        } else if (env.android) {
            adsSdk = appodealAndroid;
        }

        if (adsSdk && adsSdk.init) {
            adsSdk.init();
        }
    }

    function afterGame () {
        var userParams = getUserParams();
        
        if (!userParams.adsEnabled) {
            return vow.resolve();
        }

        if (!adsSdk) {
            return vow.resolve();
        }

        var adParams = {
                allowVideo: userParams.allTimeScore >= MIN_SCORE_FOR_VIDEO,
                allowObtrusive: userParams.allTimeScore >= MIN_SCORE_FOR_OBTRUSIVE
            },
            disclaimerCounter = storage.get('adsDisclaimerCounter'),
            promise;

        promise = new vow.Promise(function (resolve) {
            if (disclaimerCounter > 0) {
                storage.set('adsDisclaimerCounter', disclaimerCounter - 1);
                showAd(adParams, resolve);
            } else {
                storage.set('adsDisclaimerCounter', DISCLAIMER_COUNTER_MAX);
                showDisclaimer(adParams, resolve);
            }
        });

        return promise;
    }

    function getUserParams () {
        var userProps = currentUser.properties;

        if (
            userProps.maecenas ||
            (userProps.extra.ads_removed_till && new Date(userProps.extra.ads_removed_till * 1000) > new Date())
        ) {
            return { adsEnabled: false };
        }

        return {
            adsEnabled: true,
            allTimeScore: userProps.all_time_score
        };
    }

    function showAd (params, cb) {
        analytics.reachGoal('ads.show', params);

        adsSdk.show(params, function (adType, data) {
            analytics.reachGoal('ads.finish', _.extend({}, params, { adType: adType }));

            cb(data);
        }, function (err) {
            analytics.reachGoal('ads.fail', _.extend({}, params, { err: err }));

            cb({ error: err });
        });
    }
    
    function showDisclaimer (params, cb) {
        function hideThenCallback () {
            modal.hide('adsDisclaimer');
            cb();
        }

        function startOver () {
            afterGame().then(hideThenCallback);
        }
        
        modal.show('adsDisclaimer', {
            countdown: storage.get('adsDisclaimerSeen') ? 10 : null
        }, {
            showad: function () {
                showAd(params, hideThenCallback);
            },

            purchaseremoveads: function () {
                currentUser.buy('remove_ads', { source: 'ads.afterGame' })
                    .then(hideThenCallback)
                    .fail(startOver);
            },

            purchasemaecenas: function () {
                currentUser.buy('maecenas', { source: 'ads.afterGame' })
                    .then(hideThenCallback)
                    .fail(startOver);
            }
        });

        storage.set('adsDisclaimerSeen', true);
    }

    return {
        init: init,
        afterGame: afterGame
    };
});