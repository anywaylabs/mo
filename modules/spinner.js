define(['jquery', './jqm'], function ($, $mobile) {
    var stackLength = 0;

    function show () {
        // Fix for bug in iOS when `top` is somehow being set while keyboard is open.
        $('.ui-loader').css('top', '');

        if (stackLength == 0) {
            $mobile.loading('show');
        }

        stackLength++;
    }

    function hide () {
        if (stackLength == 1) {
            $mobile.loading('hide');
        }

        stackLength--;
    }

    function reshow () {
        if (stackLength > 0) {
            $mobile.loading('show');
        }
    }

    return {
        show: show,
        hide: hide,
        reshow: reshow
    }
});