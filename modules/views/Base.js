define([
    'jquery', 'lodash',
    './render',
    '../class', '../EventManager'
], function ($, _, render, classTool, EventManager) {
    return classTool.create(function ($el, template) {
        /**
         * @protected
         */
        this.$el = $el;

        this._template = template;
        this.state = '';

        this.events = new EventManager();
        this.events.trigger('init');

    }, {
        /**
         * @protected
         */
        $: function (selector) {
            return $(selector, this.$el);
        },

        /**
         * @protected
         */
        update: function (state) {
            this.state = state || {};
            this.render();
        },

        /**
         * @protected
         */
        clear: function () {
            this.state = {};
            this.render();
        },

        render: function (state) {
            return this.$el.html(render(this._template, state || this.state || {}))
                .trigger('rendered')
                .trigger('sizechange');
        },

        empty: function () {
            return this.$el.html('')
                .trigger('rendered')
                .trigger('sizechange');
        },

        scrollTop: function () {
            this.$el
                .css('display', 'block')
                .scrollTop(0)
                .css('display', '');
        },

        scrollBottom: function () {
            this.$el
                .css('display', 'block')
                .scrollTop(this.$el[0].scrollHeight)
                .css('display', '');
        }
    });
});