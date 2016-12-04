define([
    'jquery',
    '../../modal',
    '../Base',
    '../../remote/singletons/currentUser',
    '../../class'
], function ($, modal, BaseView, currentUser, classTool) {
    return classTool.create(function (template) {
        BaseView.call(this, $('#main-panel'), template);

        this.$el.panel()
            .find('[data-role="controlgroup"]')
            .controlgroup();

        this.update();
        this._setupListeners();
    }, BaseView, {
        update: function () {
            this.render({
                user: currentUser.isGuest() ? { guest: true } : currentUser.getData()
            });
        },
    
        _setupListeners: function () {
            currentUser.events.on('change', this.update.bind(this));

            var _this = this;

            $(document).on('swipeleft', function (e) {
                if (
                    $(document.body).data('layout') == 'main' &&
                    _this.$el.css('visibility') == 'hidden' &&
                    e.swipestart.coords[0] > $(window).width() * 0.9 &&
                    !modal.isShown()
                ) {
                    _this.$el.panel('open');
                }
            });

            $(window).on('resize', function () {
                _this.$el.panel('close');
            });
        }
    
    });
});