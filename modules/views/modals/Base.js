define([
    'jquery',
    '../Base',
    '../../class'
], function ($, BaseView, classTool) {
    var TRANSITION_DURATION = 250;

    return classTool.create(function ($el, template) {
        BaseView.call(this, $('#modal'), template);
    }, BaseView, {
        update: function (state) {
            this.state = state || {};
            this.render();
            this._setupCloseListeners();

            var $el = this.$el;

            $el.show();
            setTimeout(function () { $el.addClass('in'); }, 30);
        },

        clear: function () {
            this.state = {};
            this._clearCloseListeners();

            var $el = this.$el;

            $el.removeClass('in');

            setTimeout(function () {
                if (!$el.hasClass('in')) {
                    $el.hide();
                }
            }, TRANSITION_DURATION);
        },

        _setupCloseListeners: function () {
            var _this = this;
            this.$('.btn-close').on('vclick', function () {
                _this.events.trigger('close');
            });
        },

        _clearCloseListeners: function () {
            this.$('.btn-close').off('vclick');
        }
    });
});