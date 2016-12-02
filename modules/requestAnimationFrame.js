define([], function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    var rAF = window.requestAnimationFrame,
        cancel = window.cancelAnimationFrame;

    for(var x = 0; x < vendors.length && !rAF; ++x) {
        rAF = window[vendors[x]+'RequestAnimationFrame'];
        cancel = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!rAF) {
        rAF = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = setTimeout(function() { callback(currTime + timeToCall); }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }

    if (!cancel) {
        cancel = function(id) { clearTimeout(id); };
    }

    return {
        setup: function (callback, element) { return rAF(callback, element); },
        cancel: function (id) { cancel(id); }
    }
}());