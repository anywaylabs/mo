define(['jquery', 'config'], function ($, config) {
    $(window.document).on('mobileinit', function () {
        $.mobile.autoInitializePage = false;
        $.mobile.linkBindingEnabled = false;
        $.mobile.defaultPageTransition = config.regular_page_transition;
        $.mobile.hashListeningEnabled = false;
        $.mobile.pushStateEnabled = false;
        $.mobile.ignoreContentEnabled = true;
        $.mobile.hoverDelay = 0;
        $.extend($.event.special.swipe,{
//            scrollSupressionThreshold: 10, // More than this horizontal displacement, and we will suppress scrolling.
//            durationThreshold: 1000, // More time than this, and it isn't a swipe.
            horizontalDistanceThreshold: 50  // Swipe horizontal displacement must be more than this.
//            verticalDistanceThreshold: 75  // Swipe vertical displacement must be less than this.
        });
    });
});