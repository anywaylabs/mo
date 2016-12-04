const modalsContext = require.context('views/modals/', true, /\/[A-Z][A-Za-z]+$/);

define([
    'lodash', 'jquery',
    './pages', './analytics'
], function (_, $, pages, analytics) {
    var views = [],
        currentView = null,
        isShown = false;

    function init () {
        modalsContext.keys().forEach(function (key) {
            var modalClass = modalsContext(key),
                name = key.split('/')[1];

            views[name] = new modalClass();
        });
    }

    function show (name, content, handlers) {
        if (!isShown || currentView != views[name]) {
            analytics.hitModal(name, { referrer: pages.getCurrentUrl() });
        }

        isShown && hide();

        currentView = views[name];
        currentView.update(content);

        if (handlers) {
            currentView.events.on(handlers);
        }

        $('body').addClass('modal-opened');

        isShown = true;
    }

    function hide (name) {
        if (!isShown) {
            return;
        }

        if (name && currentView != views[name]) {
            return;
        }

        currentView.events.off();
        currentView.clear();

        $('body').removeClass('modal-opened');

        isShown = false;
    }

    return {
        init: init,
        show: show,
        hide: hide,
        isShown: function () {
            return isShown;
        }
    }
});