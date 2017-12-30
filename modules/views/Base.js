define([
    'jquery', 'lodash',
    './render',
    '../store', '../class', '../EventManager'
], function ($, _, render, store, classTool, EventManager) {
    var SELF_TOGGLE_TIMEOUT = 300;

    return classTool.create(function ($el, template) {
        this.events = new EventManager();
        this.events.trigger('init');

        /**
         * @protected
         */
        this.$el = $el;

        /**
         * @protected
         */
        this.state = '';

        this._template = template;

        this._selfTransitionKey = null;

        if (this.constructor.storeSources) {
            var _this = this;
            store.observe(this.constructor.storeSources, function () {
                // `update` could be overridden in a child class.
                _this.update(_this.state);
            });
        }
    }, {
        update: function (state) {
            this.state = state || {};
            this.render();
        },

        clear: function (action) {
            this.state = { action: action };
            this.render();
        },

        /**
         * @protected
         */
        $: function (selector) {
            return $(selector, this.$el);
        },

        /**
         * @protected
         */
        render: function (state) {
            state || (state = this.state || {});

            var selfTransitionKey = state.action,
                html = render(this._template, state);

            if (typeof selfTransitionKey != 'undefined' && selfTransitionKey !== null) {
                var $toggles = this.$('> .self-toggle'),
                    _this = this;

                if ($toggles.length == 2) {
                    $toggles.eq(1).html(html);
                } else if (selfTransitionKey === this._selfTransitionKey) {
                    $toggles.eq(0).html(html);
                } else {
                    this.$el.append(`<div class="self-toggle">${html}</div>`);

                    if ($toggles.length) {
                        setTimeout(function () {
                            $toggles.eq(0).remove();

                            _this.$el.trigger('rendered');
                        }, SELF_TOGGLE_TIMEOUT);
                    }
                }
            } else {
                this.$el.html(html);
            }

            return this.$el
                .trigger('rendered')
                .trigger('sizechange');
        },

        /**
         * @protected
         */
        empty: function () {
            return this.$el.html('')
                .trigger('rendered')
                .trigger('sizechange');
        },

        /**
         * @protected
         */
        scrollTop: function () {
            this.$el
                .css('display', 'block')
                .scrollTop(0)
                .css('display', '');
        },

        /**
         * @protected
         */
        scrollBottom: function () {
            this.$el
                .css('display', 'block')
                .scrollTop(this.$el[0].scrollHeight)
                .css('display', '');
        }
    });
});
