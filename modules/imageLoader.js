define(['jquery', 'lodash', 'vow', 'config'], function ($, _, vow, config) {
    function load (src) {
        var deferred = vow.defer(),
            img = new Image();

        $(img)
            .on('load', function () { deferred.resolve(true); })
            .on('error', function () { deferred.reject(); });

        img.src = src;

        if (config.debug) {
            console.log('Image load: ' + src);
        }

        return deferred.promise();
    }

    function loadAll (srcs) {
        var promises = [];

        _.each(srcs, function (src, i) {
            promises.push(load(src));
        });

        return vow.all(promises);
    }

    return {
        load: load,
        loadAll: loadAll
    }
});