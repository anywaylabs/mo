define([
    'jquery',
    '../Base',
    '../../class',
    '../../requestAnimationFrame'
], function ($, BaseView, classTool, rAF) {
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
            rAF.setup(function () { $el.addClass('in'); });
        },

        clear: function () {
            this.state = {};
            this._clearCloseListeners();

            var $el = this.$el;

            rAF.setup(function () { $el.removeClass('in'); });

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
