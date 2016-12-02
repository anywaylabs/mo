define(['jquery', './class'], function ($, classTool) {
    return classTool.create(function () {
        this._$el = $('<div>');
    }, {
        on: function () {
            return this._$el.on.apply(this._$el, arguments);
        },

        one: function () {
            return this._$el.one.apply(this._$el, arguments);
        },

        off: function () {
            return this._$el.off.apply(this._$el, arguments);
        },

        trigger: function () {
            return this._$el.trigger.apply(this._$el, arguments);
        },

        setParent: function (eventManager) {
            // Hack.
            this._$el.appendTo(eventManager._$el);
        },

        destroy: function () {
            this._$el.remove();
        }
    });
});