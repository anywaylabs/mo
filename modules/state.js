define(['jquery'], function ($) {

var defaults = {
        authToken: '',
        autoLoginUserId: 0,
        currentUserId: 0,
        reset: reset
    },
    state = {};

function reset () {
    $.extend(state, defaults);
}

reset();

return state;

});