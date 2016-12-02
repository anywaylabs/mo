define([
    '../../env',
    //'../vkontakte/loginInAppBrowser',
    '../vkontakte/loginSocialSdk'
], function (env, loginSocialSdk) {
    if (env.phonegap) {
        return loginSocialSdk;
    }
});