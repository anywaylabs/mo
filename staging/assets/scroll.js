$(function () {
    $('iframe').load(function () {
        $(this).contents()
            .find('html')
            .css('overflow', 'hidden')
            .end()
            .find('body')
            .css('overflow', 'hidden');
    });

    $(window).bind('scroll', function () {
        $('iframe').contents().scrollTop(window.scrollY);
    });
});