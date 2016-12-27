const pagesContext = require.context('pages/', false, /^\.\/\w+$/i);
const viewsContext = require.context('views/pages/', true, /\/[A-Z][A-Za-z]+$/);

define([
    'config',
    'jquery', './jqm', 'lodash',
    './pages/Base',
    './analytics'
], function (config, $, $mobile, _, BasePage, analytics) {
    var pages = {},
        // TODO => Config
        nonReturnablePages = [];

    function init () {
        var keys = pagesContext.keys(),
            pageClasses = {},
            viewClasses = {};

        _.each(keys, function (key, i) {
            var pageClass = pagesContext(key),
                name = _.lowerFirst(key.replace('./', ''));

            pageClasses[name] = pageClass;
            viewClasses[name] = viewsContext(key.replace('./', './' + name + '/'));

            $(document.body).append(
                '<div data-role="page"' +
                '   id="page-' + name + '"' +
                '   data-layout="' + (pageClass.LAYOUT || 'main') + '"' +
                '   data-skin="' + (pageClass.SKIN || 'light') + '"' +
                '   data-title="' + (pageClass.TITLE || '') + '"' +
                '/>'
            );
        });

        $mobile.initializePage();

        $('[data-role=page]').each(function () {
            $(document.body).pagecontainer('load', '#' + this.id, {showLoadMsg: false});
        });

        _.each(pageClasses, function (pageClass, name) {
            pages[name] = new pageClass(name, viewClasses[name]);
        });

        $.mobile.changePage.defaults = _.extend($.mobile.changePage.defaults, {
            changeHash: false,
            allowSamePageTransition: true
        });
    }

    function getPage (name) {
        if (config.debug) {
            if (!pages[name]) {
                throw new Error('./pages.get: Page `' + name + '` not found.');
            }
        }

        return pages[name];
    }

    function change (name, params, pageParams) {
        if (config.debug) {
            if (!pages[name]) {
                throw new Error('./pages.change: Page `' + name + '` not found.');
            }
        }

        var url = '#page-' + name;

        if (!$(url).length) {
            url = name + '.html';
        }

        analytics.hit(url, {
            title: getTitle(name),
            referrer: getCurrentUrl()
        });

        getPage(name).setParams(pageParams);

        // Workaround for #391.
        if (url.replace('#', '') == $.mobile.firstPage.attr('id')) {
            $.mobile.navigate.history.add(url, params);
        }

        $(document.body).pagecontainer('change', url, params);
        $.mobile.navigate.history.getActive().pageParams = pageParams;
    }

    function back () {
        if (nonReturnablePages.indexOf(getCurrent()) != -1) {
            return;
        }

        var prevPage = $.mobile.navigate.history.getPrev();

        if (prevPage && prevPage.pageUrl) {
            var prevPageName = prevPage.pageUrl.replace('page-', '');

            if (nonReturnablePages.indexOf(prevPageName) == -1) {
                analytics.hit('#' + prevPage.pageUrl, {
                    title: getTitle(prevPageName),
                    referrer: getCurrentUrl()
                });

                if (prevPage.pageParams) {
                    getPage(prevPageName).setParams(prevPage.pageParams);
                }

                $.mobile.back();
                return;
            }
        }

        change('home', { direction: 'reverse' });
    }

    function getCurrent () {
        return ($.mobile.navigate.history.getActive().pageUrl || $.mobile.activePage.attr('id'))
            .replace('page-', '');
    }

    function getCurrentUrl () {
        return '#' + ($.mobile.navigate.history.getActive().pageUrl || $.mobile.activePage.attr('id'));
    }

    function getTitle (name) {
        return $('#page-' + name).data('title');
    }

    return {
        init: init,
        get: getPage,
        change: change,
        getCurrent: getCurrent,
        getCurrentUrl: getCurrentUrl,
        back: back
    };
});