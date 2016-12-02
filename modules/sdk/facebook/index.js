define([
    'config',
    '../../env',
    '../facebook/login',
    '../facebook/invite'
], function (config, env, login, invite) {
    function init () {
    }

    return {
        init: init,
        login: login,
        invite: invite
    }
});