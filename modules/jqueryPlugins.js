define(['jquery'], function ($) {
    $.fn.preload = function (path) {
        return this.each(function (i, v) {
            setTimeout(function () {
                // mobdevtip need to add to DOM
                $(document.body).append('<img src="' + path + v + '" style="display: none;" />');
            }, 10);
        });
    };

    $.fn.disableSelection = function () {
        return this
            .attr('unselectable', 'on')
            .css('MozUserSelect', 'none')
            .bind('selectstart.ui', function() { return false; });
    };

    $.fn.center = function () {
        return this.css({
            top: ($(window).height() - this.height()) / 2 + $(window).scrollTop(),
            left: ($(window).width() - this.width()) / 2 + $(window).scrollLeft()
        });
    };

    $.fn.bounds = function () {
        var el = this[0],
            offset = this.offset();

        return [
            [offset.top, offset.left],
            [offset.top + el.offsetHeight, offset.left + el.offsetWidth]
        ];
    };

    $.fn.fitText = function( kompressor, options ) {
        var compressor = kompressor || 1,
            settings = $.extend({
                'minFontSize' : Number.NEGATIVE_INFINITY,
                'maxFontSize' : Number.POSITIVE_INFINITY
            }, options);

        return this.each(function(){

            // Store the object
            var $this = $(this);

            // Resizer() resizes items based on the object width divided by the compressor * 10
            var resizer = function () {
                $this.css('font-size', Math.max(Math.min($this.width() / (compressor*10), parseFloat(settings.maxFontSize)), parseFloat(settings.minFontSize)));
            };

            // Call once to set.
//            resizer();

            // Call on resize. Opera debounces their resize by default.
//            $(window).on('resize.fittext orientationchange.fittext', resizer);

        });
    };
});