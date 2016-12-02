define([
    'jquery',
    '../Base',
    '../../class', '../../requestAnimationFrame', '../../env',
    './popup.hbs'
], function ($, BaseView, classTool, rAF, env, template) {
    var HIDE_DURATION = 300;

    return classTool.create(function ($el) {
        BaseView.call(this, $el, template);

        this._$proxy = $('#popup-proxy');

        this._setupListeners();
    }, BaseView, {
        _setupListeners: function () {
            var _this = this;

            this.$el.add(this._$proxy).on('vclick', function () {
                // Workaround for #392.
                if (_this.$el.is('.min')) {
                    _this._afterHide();

                    return;
                }

                _this.events.trigger('click');
            });

            this.$el.on('click', 'a', function (e) {
                if (!$(this).is('.btn')) {
                    e.stopPropagation();
                }
            });
        },

        build: function (params) {
            this._clearElement();
            this._clearProxy();

            if (params.proxy) {
                this._setupProxy(params);
            }

            this._setupElement(params);
            this.update(params);

            if (params.buttons) {
                this._setupButtons(params);
            }

            if (params.content) {
                this._show(params);
            }
        },

        clear: function (callback) {
            var _this = this;

            rAF.setup(function () {
                _this.$el.addClass('min');

                setTimeout(function () {
                    _this._afterHide(callback);
                }, HIDE_DURATION);
            });
        },

        _show: function (params) {
            var $el = this.$el;
            $el.show();
            rAF.setup(function () {
                $el.css(params.css || {
                    top: env.vkontakte ? 200 - $el.height() / 2 : ($(window).height() - $el.height()) / 2,
                    left: ($(window).width() - $el.width()) / 2
                });

                $el.removeClass('min');
            });
        },

        _afterHide: function (callback) {
            this.$el.hide();
            this._clearButtons();
            this.update({});
            this._clearProxy();
            this._clearElement();
            callback && callback();
        },

        _setupElement: function (params) {
            this.$el
                .addClass(params.type)
                .css({ bottom: '', right: '' });

            if (params.bubble) {
                this.$el.addClass('bubble');
            }
        },

        _clearElement: function () {
            this.$el[0].className = 'min';
        },

        _setupProxy: function (params) {
            if (params.proxy) {
                this._$proxy.css({ height: $(document).height() });

                if (typeof params.proxy == 'string') {
                    this._$proxy.addClass(params.proxy);
                }

                this._$proxy.addClass('shown');
            }
        },

        _clearProxy: function () {
            this._$proxy[0].className = '';
        },

        _setupButtons: function (params) {
            this.$('.tools .btn').each(function (i) {
                if (params.buttons[i].handlers) {
                    $(this).on(params.buttons[i].handlers);
                }
            });
        },

        _clearButtons: function () {
            this.$('.tools .btn').off();
        }
    });
});