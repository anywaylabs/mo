define([
    'jquery', 'lodash',
    './render',
    '../store', '../class', '../EventManager'
], function ($, _, render, store, classTool, EventManager) {
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

        if (this.constructor.storeSources) {
            var _this = this;
            store.observe(this.constructor.storeSources, function () {
                // `update` could be overridden in a child class.
                this.update(this.state);
            });
        }
    }, {
        update: function (state) {
            this.state = state || {};
            this.render();
        },

        clear: function () {
            this.state = {};
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
            return this.$el.html(render(this._template, state || this.state || {}))
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
