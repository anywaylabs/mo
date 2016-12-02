define([
    'lodash'
], function (_) {
    var COUNTER_ID = 26664282;

    var counter,
        visitParams;

    function init (params) {
        visitParams = params;
        
        (function (d, w, c) {
            (w[c] = w[c] || []).push(function() {
                try {
                    counter = w['yaCounter' + COUNTER_ID] = new Ya.Metrika({
                        id:COUNTER_ID,
                        clickmap:true,
                        trackLinks:true,
                        accurateTrackBounce:true,
                        ut:"noindex",
                        params: visitParams
                    });
                } catch(e) { }
            });

            var n = d.getElementsByTagName("script")[0],
                s = d.createElement("script"),
                f = function () { n.parentNode.insertBefore(s, n); };
            s.type = "text/javascript";
            s.async = true;
            s.src = "https://mc.yandex.ru/metrika/watch.js";

            if (w.opera == "[object Opera]") {
                d.addEventListener("DOMContentLoaded", f, false);
            } else { f(); }
        })(document, window, "yandex_metrika_callbacks");
    }

    function setParams (params) {
        visitParams = params;

        counter && counter.params(params);
    }

    function hit (url, options) {
        if (options.referrer) {
            options.referer = options.referrer;
        }
        options.params = _.extend({}, visitParams, options.params || {});

        counter && counter.hit(url, options);
    }

    function reachGoal (target, params) {
        params = _.extend({}, visitParams, params || {});

        counter && counter.reachGoal(target, params);
    }
    return {
        init: init,
        setParams: setParams,
        hit: hit,
        reachGoal: reachGoal
    }
});