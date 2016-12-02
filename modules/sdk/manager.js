define([
    'vow',
    '../../env',
    '../vkontakte/index',
    '../facebook/index',
    '../odnoklassniki/index',
    '../phonegap/index'
], function (vow, env, sdkVkontakte, sdkFacebook, sdkOdnoklassniki, sdkPhonegap) {
    var envSdk = {};

    if (env.vkontakte) {
        envSdk = sdkVkontakte;
    } else if (env.facebook) {
        envSdk = sdkFacebook;
    } else if (env.odnoklassniki) {
        envSdk = sdkOdnoklassniki;
    } else if (env.phonegap) {
        envSdk = sdkPhonegap;
    }

    function init () {
        if (envSdk && envSdk.init) {
            envSdk.init();
        }
    }

    function getSdkByProvider (provider) {
        switch (provider) {
            case 'vkontakte': return sdkVkontakte;
            case 'facebook': return sdkFacebook;
            case 'odnoklassniki': return sdkOdnoklassniki;
            case 'phonegap': return sdkPhonegap;
            default: return {};
        }
    }

    function invite (provider, existing) {
        var sdk = getSdkByProvider(provider);

        if (sdk.invite) {
            return sdk.invite(existing);
        }

        return vow.reject({ error: 'Приглашения недоступны' });
    }

    function wallPost (params) {
        if (envSdk.wallPost) {
            return envSdk.wallPost(params);
        }

        return vow.reject({ error: 'Публикации недоступны' });
    }

    return {
        init: init,
        getSdk: getSdkByProvider,
        invite: invite,
        wallPost: wallPost,
        purchase: envSdk.purchase,
        resizeContainer: envSdk.resizeContainer
    };
});