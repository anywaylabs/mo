define(['lodash', 'config', './connect'], function (_, config, connect) {
    var delta = null,
        syncRunning = false,
        syncRequestsCount = 3,
        syncRequestMaxTime = 7,
        syncTotalMaxTime = 10,
        syncMaxMedianDuration = 4,
        syncRepeatTimeout = 5,
        syncRequests,
        syncTotalTimeout;

    function init () {
        connect.on('connect', sync);
        connect.on('disconnect', function () {
            delta = null;
        });
    }

    function sync () {
        if (syncRunning) {
            return;
        }

        syncRunning = true;
        delta = null;
        syncRequests = [];

        syncTotalTimeout = setTimeout(fail, syncTotalMaxTime * 1000);
        
        doSync();
    }

    function doSync () {
        if (!syncRunning) {
            return;
        }
        
        var n = syncRequests.length,
            time = (new Date()).getTime(),
            requestId = (time + Math.random()).toString(),
            request = { number: n, startTime: (new Date()).getTime() };

        if (config.debug) {
            console.log('servertime sync start: #' + n);
        }

        var currentTimeout = setTimeout(fail, syncRequestMaxTime * 1000);

        connect.push('/sync/time', { request_id: requestId });
        connect.once('sync:time', function (e, data) {
            if (!syncRunning || data.request_id != requestId) {
                return;
            }

            clearTimeout(currentTimeout);

            request.finishTime = (new Date()).getTime();
            request.serverTime = data.time;
            request.duration = (request.finishTime - request.startTime);

            if (config.debug) {
                console.log('servertime sync finish: #' + n + ' took ' + request.duration + 'ms');
            }

            if (syncRequests.length < syncRequestsCount) {
                doSync();
            } else {
                complete();
            }
        });
        
        syncRequests.push(request);
    }

    function complete () {
        if (!syncRunning) {
            return;
        }

        var sorted = _.sortBy(syncRequests, 'duration'),
            median = sorted[Math.floor(syncRequests.length / 2)],
            min = sorted[0];

        if (config.debug) {
            console.log('servertime median duration: ' + median.duration);
        }

        median.duration > syncMaxMedianDuration * 1000 ?
            fail() :
            success(min.finishTime - min.serverTime);
    }

    function fail () {
        if (!syncRunning) {
            return;
        }

        syncRunning = false;
        clearTimeout(syncTotalTimeout);

        if (config.debug) {
            console.log('ERROR: servertime sync failed');
        }

        delta = null;

        setTimeout(sync, syncRepeatTimeout * 1000);
    }

    function success (newDelta) {
        if (!syncRunning) {
            return;
        }

        syncRunning = false;
        clearTimeout(syncTotalTimeout);

        delta = newDelta;

        if (config.debug) {
            console.log('servertime delta: ' + delta);
        }
    }

    function get () {
        return typeof delta == 'number' ? (new Date()).getTime() - delta : null;
    }

    return {
        init: init,
        get: get
    }
});