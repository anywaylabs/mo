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
        this._content = '';
        
        this.events = new EventManager();
        this.events.trigger('init');

    }, {
        init: function ($el) {

        },

        empty: function () {
            return this.$el.html('')
                .trigger('rendered')
                .trigger('sizechange');
        },

        /**
         * @abstract
         */
        build: function () {},

        /**
         * @abstract
         */
        clear: function () {},

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
        },
        
        update: function (content) {
            this._content = content || {};
            this.render();
        },

        /**
         * @protected
         */
        render: function () {
            return this.$el.html(render(this._template, this._content))
                .trigger('rendered')
                .trigger('sizechange');
        },

        /**
         * @protected
         */
        $: function (selector) {
            return $(selector, this.$el);
        }
    });
});