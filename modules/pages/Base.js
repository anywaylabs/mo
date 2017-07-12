define([
    'jquery', 'lodash',
    'config',
    '../class'
], function ($, _, config, classTool) {
    return classTool.create(function (name, viewClass, viewHandlers, paramsHandlers) {
        this._name = name;

        this._$page = $('#page-' + this._name);

        /**
         * @protected
         */
        this.view = null;
        this._setupView(viewClass, viewHandlers);

        /**
         * @protected
         */
        this._params = {};
        this._paramsHandlers = paramsHandlers || {};

        this._setupHandlers();
    }, {
        setParams: function (params) {
            this._params = _.extend(this._params, params);

            if (typeof this._paramsHandlers == 'function') {
                this._paramsHandlers.call(this, params);

                return;
            }

            var _this = this;

            _.each(params, function (value, param) {
                if (_this._paramsHandlers[param]) {
                    _this._paramsHandlers[param].call(_this, value);
                }
            });
        },

        /**
         * @protected
         */
        clearParams: function () {
            this._params = {};
        },

        /**
         * @protected
         */
        onBeforeShow: function () {},

        /**
         * @protected
         */
        onShow: function () {},

        /**
         * @protected
         */
        onBeforeHide: function () {},

        /**
         * @protected
         */
        onHide: function () {},

        _setupView: function (viewClass, viewHandlers) {
            if (config.debug) {
                if (typeof viewClass != 'function') {
                    throw new Error('ERROR: Page ' + this._name + ' view is not a class.');
                }
            }

            var _this = this,
                template = 'pages/' + this._name;

            this.view = new viewClass(this._$page, template);
            this.view.events.on(_.keys(viewHandlers).join(' '), function (e, data) {
                var result = viewHandlers[e.type].call(_this, e, data);

                if (data && typeof data.release == 'function' && result && typeof result.then == 'function') {
                    result.then(data.release);
                }
            });
        },

        _setupHandlers: function () {
            var handlers = {
                    pagebeforeshow: 'onBeforeShow',
                    pageshow: 'onShow',
                    pagebeforehide: 'onBeforeHide',
                    pagehide: 'onHide'
                };

            this._$page.on(_.keys(handlers).join(' '), _.bind(function (e) {
                if (config.debug) {
                    console.log('PAGE ' + this._name + ' EVENT ' + e.type);
                }

                this[handlers[e.type]]();
            }, this));
        }
    });
});