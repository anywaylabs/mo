define(['jquery'], function ($) {
    var $script = $('script[data-version]'),
        assetsVersion = $script.length ? $script.attr('data-version') : null;

    if (assetsVersion == 'dev') {
        assetsVersion = '.';
    }

    function getDir () {
        return (assetsVersion || '.') + '/';
    }

    return {
        getDir: getDir
    };
});