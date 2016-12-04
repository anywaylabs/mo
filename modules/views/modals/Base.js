define([
    'jquery',
    '../Base',
    '../../class'
], function ($, BaseView, classTool) {
    return classTool.create(function ($el, template) {
        BaseView.call(this, $('#modal'), template);
    }, BaseView, {
        update: function (state) {
            this.render(state);
            this._setupListeners();

            this.$el
                .addClass('in')
                .show();
        },

        clear: function () {
            this._clearListeners();

            var $el = this.$el;

            $el.removeClass('in');

            setTimeout(function () {
                if (!$el.hasClass('in')) {
                    $el.hide();
                }
            }, 100);
        },

        _setupListeners: function () {

        },

        _clearListeners: function () {

        }
    });
});