define(['vow', 'config'], function (vow, config) {
    function insist (maxRepeats, timeout, cb, context, repeatsIndex) {
        timeout || (timeout = 1000);
        maxRepeats || (maxRepeats = 10);
        repeatsIndex || (repeatsIndex = 0);

        if (config.debug) {
            console.log('./insist attempt #' + repeatsIndex);
        }

        var promise = context ? cb.call(context, repeatsIndex) : cb(repeatsIndex);

        if (repeatsIndex < maxRepeats - 1) {
            return promise.fail(function () {
                var deferred = vow.defer();

                setTimeout(function () {
                    deferred.resolve(insist(maxRepeats, timeout, cb, context, ++repeatsIndex));
                }, timeout);

                return deferred.promise();
            });
        } else {
            return promise;
        }
    }

    return insist;
});