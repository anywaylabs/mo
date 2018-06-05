define([
    'jquery',
    'config',
    './pages',
    './env'
], function ($, config, pages, env) {
    var BIND_SELECTOR = 'a, button, label, [data-bind-clicks]',
        HOVER_DELAY = 60,
        EXTRA_HOVER_DURATION = 100;

    return function () {
        // На тач устройствах слушаем только vclick (touchend).
        if (config.secure_vclick && env.touch) {
            $(document).on('click', BIND_SELECTOR, function (e, data) {
                if (!env.touch) {
                    if (typeof NREUM != 'undefined') {
                        NREUM.noticeError(new Error('First touch detection was wrong.'));
                    }

                    return;
                }

                // И самостоятельно генерим клики, если надо.
                if (data && data.triggeredAfterVClick) {
                    return;
                }

                // Ссылки с target нельзя открыть с помощью trigger@click.
                if (!$(this).attr('target')) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                } else if (env.phonegap && $(this).attr('target') == '_blank') {
                    e.preventDefault();
                    window.open($(this).attr('href'), '_system');
                }
            });
        }

        $(document).on('vclick', BIND_SELECTOR, function (e) {
            var $this = $(this);

            // Links with `target` are processed directly.
            // Inputs ignore manual events triggering, so we don't handle them anymore.
            if ($this.attr('target') || $(e.target).is('input, textarea')) {
                return;
            }

            if (env.touch) {
                // Чтобы не было отложенного срабатывания.
                e.preventDefault();
            }

            var nativeAndBindEnabled = $this.is('button, label');

            // Если @click прошел, значит его сгенерили и уже обработали мы.
            if (config.secure_vclick && env.touch && e.originalEvent.type == 'click') {
                return;
            }

            if ($this.data('remote') || $this.attr('rel') || nativeAndBindEnabled) {
                if (config.secure_vclick && env.touch) {
                    // Тут нужно выполнить реальный клик, вместо того, который мы запревентили.
                    $this.trigger('click', { triggeredAfterVClick: true });
                }

                if (!nativeAndBindEnabled) {
                    return;
                }
            }

            if (!nativeAndBindEnabled) {
                // Для остальных случаев не предполагается стандартного поведения.
                e.originalEvent.preventDefault();
            }

            var href = $this.attr('href');

            // Тут могут выполняться обычные обработчики в приложении.
            if (!href || href == '#') {
                return;
            }

            if (href.indexOf('#page-') === 0) {
                pages.change(href.replace('#page-', ''), {
                    transition: $this.data('transition'),
                    reverse: $this.data('direction') == 'reverse'
                }, $this.data('params'));
            } else if (href == '#:back') {
                pages.back(/* can't pass params :( */);
            } else if (href.indexOf('tel:') === 0) {
                window.open(href, '_system');
            } else if (config.debug) {
                navigator.notification.alert('Ошибка обработки ссылки: ' + $this.attr('href'), 'DEBUG');
            }
        });

        $(document).on('touchstart', BIND_SELECTOR, function () {
            var $el = $(this);

            $el.data('touched', true);

            setTimeout(function () {
                if ($el.data('touched')) {
                    hover($el);
                }
            }, HOVER_DELAY);
        });

        $(document).on('touchend scrollstart', BIND_SELECTOR, function () {
            var $el = $(this);

            $el.data('touched', false);
            $el.removeClass('hover');
        });

        $(document).on('vclick touchcancel', BIND_SELECTOR, function () {
            var $el = $(this);

            if ($el.data('hover')) {
                unhover($el);
            } else {
                hover($el);
                setTimeout(function () {
                    unhover($el);
                }, EXTRA_HOVER_DURATION);
            }

            $el.data('touched', false);
        });

        /*
        ** Fix for form input lag on some devices
        */
        $(document).on('focus', '.form-group input, .form-group textarea', (e) => {
            $(e.currentTarget).parent('label').addClass('focused');
        });
        $(document).on('blur', '.form-group input, .form-group textarea', (e) => {
            $(e.currentTarget).parent('label').removeClass('focused');
        });

        function hover ($el) {
            $el.addClass('hover');
            $el.data('hover', true);
        }

        function unhover ($el) {
            $el.removeClass('hover');
            $el.data('hover', false);
        }
    }
});
