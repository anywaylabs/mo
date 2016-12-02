define(['vow', '../../env', '../vkontakte/vendorSdk'], function (vow, env, vendorSdk) {
    var FRAME_MARGIN_BOTTOM = 20,
        FRAME_OFFSET_TOP = 72;

    var setupPageHeight = 0,
        setupScrollToApp = false,
        screenHeightDeferred = null;

    function init () {
        vendorSdk.promise().then(function (VK) {
            VK.addCallback('onScrollTop', function (scrollTop, availHeight, offsetTop) {
                onScrollTop(VK, scrollTop, availHeight, offsetTop);
            });
        });
    }

    function resize (width, height, scrollToApp) {
        return vendorSdk.promise().then(function (VK) {
            screenHeightDeferred = vow.defer();
            setupPageHeight = height || 0;
            setupScrollToApp = scrollToApp || false;

            if (!env.browser.ie) {
                VK.callMethod('scrollTop');
            } else {
                // Workaround for #186
                onScrollTop(VK, -1, screen.availHeight - 100, FRAME_OFFSET_TOP);
            }

            return screenHeightDeferred.promise();
        });
    }

    function onScrollTop (VK, scrollTop, availHeight, offsetTop) {
        var scrollTo = setupScrollToApp ? offsetTop : 0,
            minHeight = scrollTo + availHeight - offsetTop - FRAME_MARGIN_BOTTOM;

        if (scrollTop != scrollTo) {
            VK.callMethod('scrollWindow', scrollTo, 500);
        }

        resizeFrame(VK, Math.max(setupPageHeight, minHeight));
    }

    function resizeFrame (VK, height) {
        screenHeightDeferred.resolve(height);
        VK.callMethod('resizeWindow', 0, height);
    }

    return {
        init: init,
        resize: resize
    }
});