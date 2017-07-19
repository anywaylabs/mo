const componentsContext = require.context('views/components/', true, /\/[A-Z][A-Za-z]+$/);

define([
    'lodash', 'jquery', '../jqm', '../bouncefix',
    '../events', '../pages', '../popup', '../music', '../modal',
    './render',
    '../env', '../spinner', '../playSound', '../statusBar', '../keyboard',
    './layout.hbs'
], function (
    _, $, $mobile, bouncefix,
    events, pages, popup, music, modal,
    render,
    env, spinner, playSound, statusBar, keyboard,
    layoutTemplate
) {
    var currentLayout = null,
        currentSkin = null,
        $body = null,
        pageWithKeyboard = null,
        swipeToBackEnabled = false;

    function init () {
        $body = $(document.body);

        setupEnvironment();
        modernize();

        $body.prepend(render(layoutTemplate));

        applyBouncefix();
        setupComponents();
        setupPopup();
        setupModal();
        setupSpinnerReshow();
        setupHeaders();
        setupFooters();
        setupTouchEvents();
        setupSounds();
        setupBodyClassObserver();
        setupKeyboard();

        $(document).one('pageshow', function () {
            introOut(function () {
                statusBar.overlaysWebView(true);
                if (env.supports.statusBarOverlay && !env.android) {
                    statusBar.show();
                }
            });
        });
    }

    function setupEnvironment () {
        if (env.vkontakte) {
            $body.addClass('env-vkontakte');
        } else if (env.facebook) {
            $body.addClass('env-facebook');
        } else if (env.phonegap) {
            $body.addClass('env-phonegap');
        }

        if (env.iOS) {
            $body.addClass('env-ios');
        } else if (env.android) {
            $body.addClass('env-android');
        } else if (navigator.appVersion.indexOf('Win') != -1) {
            $body.addClass('env-win');
        }

        if (env.browser.mozilla) {
            $body.addClass('env-mozilla');
        }
    }

    function modernize () {
        if (!(env.touch && env.iOS)) {
            $body.addClass('hoverable');
        }

        if (env.vkontakte) {
            $body.addClass('stretchable-pages');
        }

        if (env.supports.statusBarOverlay) {
            $body.addClass('status-bar-overlays-web-view');
        }
    }

    function applyBouncefix () {
        bouncefix.add('ui-page');
    }

    function setupComponents () {
        _.each(componentsContext.keys(), function (key) {
            var componentClass = componentsContext(key);
            new componentClass();
        });
    }

    function setupPopup () {
        popup.init($('#popup'));
    }

    function setupModal () {
        modal.init();
    }

    function setupSpinnerReshow () {
        // Workaround for #526.
        $(document).on('pageshow', spinner.reshow);
    }

    function setupHeaders () {
        var $header = $('#main-header');

        $('.ui-page').on('pagebeforeshow rendered', function () {
            var $page = $(this),
                $pageHeader = $page.find('.header.fixed');

            if (!$page.html() || pages.getCurrent() != $page.attr('id').replace('page-', '')) {
                return;
            }

            swipeToBackEnabled = $page.find('.header .back-ico').length > 0;

            if (!$pageHeader.length) {
                $header.html('');
                $header.addClass('hidden');
            } else {
                $header.html($pageHeader.html());
                $header[0].className = $pageHeader[0].className;
            }

            if ($page.data('skin') == 'dark') {
                statusBar.light();
            } else {
                statusBar.dark();
            }
        });
    }

    function setupFooters () {
        var $footer = $('#main-footer');

        $('.ui-page').on('pagebeforeshow rendered', function () {
            var $page = $(this),
                $pageFooter = $page.find('.footer.fixed');

            if (!$page.html() || pages.getCurrent() != $page.attr('id').replace('page-', '') || $pageFooter.is('.local-only')) {
                return;
            }

            if (!$pageFooter.length) {
                $footer.html('');
                $footer.addClass('hidden');
            } else {
                $footer.html($pageFooter.html());
                $footer[0].className = $pageFooter[0].className;
            }
        });
    }

    function setupTouchEvents () {
        $(document).on('swiperight', function (e) {
            if (
                swipeToBackEnabled &&
                $('#main-panel').css('visibility') == 'hidden' &&
                e.swipestart.coords[0] < $(window).width() * 0.1 &&
                !modal.isShown()
            ) {
                pages.back();
            }
        });
    }

    function setupSounds () {
        $(document).on('vclick', 'a, label, button', function (e) {
            playSound('pk');
        });
    }

    function introOut (cb) {
        $body.removeClass('hidden');

        var $intro = $('#intro').addClass('out');
        setTimeout(function () {
            $intro.fadeOut(function () {
                $intro.remove();
                cb();
            });
        }, 1100);
    }

    function setupKeyboard () {
        // When `native.keyboard` plugin installed.
        if (keyboard.isPluginSupported()) {
            keyboard.disableScroll(true);
            keyboard.hideKeyboardAccessoryBar(true);

            window.addEventListener('native.keyboardshow', function (e) {
                pageWithKeyboard = pages.getCurrent();
                $('#page-' + pageWithKeyboard).css('padding-bottom', e.keyboardHeight);
                $('#popup').css('transform', 'translate3d(0, -' + (e.keyboardHeight / 2) + 'px, 0)');
            });

            window.addEventListener('native.keyboardhide', function () {
                $('#page-' + pageWithKeyboard).css('padding-bottom', '');
                $('#popup').css('transform', '');
            });

            $(document).on('vclick', function (e) {
                if (!$(e.target).is('input') && !$(e.target).is('textarea') && !$(e.target).is('.btn')) {
                    keyboard.hide();
                }
            });
        // Fix for https://github.com/anywaylabs/mo/issues/20 without `native.keyboard` plugin.
        } else {
            var keyboardFieldsSelector = 'input:not([type=checkbox]):not([type=radio]), select, textarea',
                $toolbars = $('#main-header, #main-footer'),
                hiddenFixedClassName = 'ui-fixed-hidden';

            $(document).on('focusin focusout', keyboardFieldsSelector, function (e) {
                if (e.type == 'focusin') {
                    $toolbars.addClass(hiddenFixedClassName);
                } else {
                    setTimeout(function () {
                        $toolbars.removeClass(hiddenFixedClassName);
                    }, 1000);
                }
            });
        }
    }

    function setupBodyClassObserver () {
        var $pages = $('[data-role=page]');

        $pages.on('pagebeforeshow', function () {
            var $page = $(this),
                pageLayout = $page.data('layout') || 'main',
                pageSkin = $page.data('skin') || 'light';

            if (currentLayout != pageLayout) {
                $body.data('layout', pageLayout);
                $body
                    .removeClass('layout-' + currentLayout)
                    .addClass('layout-' + pageLayout);

                currentLayout = pageLayout;
            }

            if (currentSkin != pageSkin) {
                $body
                    .removeClass('skin-' + currentSkin)
                    .addClass('skin-' + pageSkin);

                currentSkin = pageSkin;
            }
        });
    }

    return {
        init: init
    };
});
