define([
    'jquery', 'lodash',
    'config',
    '../class', '../helpers'
], function ($, _, config, classTool, helpers) {
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

            _.each(params, function (value, param) {
                if (this._paramsHandlers[param]) {
                    this._paramsHandlers[param].call(this, value);
                }
            }, this);
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
                template = 'pages/' + helpers.string.undasherize(this._name);

            this.view = new viewClass(this._$page, template);
            this.view.events.on(_.keys(viewHandlers).join(' '), function (e, data) {
                viewHandlers[e.type].call(_this, e, data);
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