define([
    '../vkontakte/api',
    '../vkontakte/remoteApi',
    '../vkontakte/login',
    '../vkontakte/invite',
    '../vkontakte/wallPost',
    '../vkontakte/purchase',
    '../vkontakte/containerResizer'
], function (api, remoteApi, login, invite, wallPost, purchase, containerResizer) {

    function init () {
        containerResizer.init();
    }

    return {
        init: init,
        api: api,
        remoteApi: remoteApi,
        login: login,
        invite: invite,
        wallPost: wallPost,
        purchase: purchase,
        resizeContainer: containerResizer.resize
    }
});