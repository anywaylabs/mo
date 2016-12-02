define([
    'jquery',
    '../Base',
    '../../class'
], function ($, BaseView, classTool) {
    return classTool.create(function ($el, template) {
        BaseView.call(this, $('#modal'), template);
    }, BaseView, {
        build: function (content) {
            this.update(content);
            this._setupListeners();

            this.$el
                .addClass('in')
                .show();

            BaseView.prototype.build.call(this);
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

            BaseView.prototype.clear.call(this);
        },

        _setupListeners: function () {

        },

        _clearListeners: function () {

        }
    });
});