define({
    _defaults: {
        musicEnabled: true,
        soundsEnabled: true,
        vibrationEnabled: true,
        authToken: null,
        boostBonusPromotionCounter: 9,
        deviceToken: null,
        adsDisclaimerSeen: false,
        adsDisclaimerCounter: 0
    },

    set: function (key, value) {
        if (typeof localStorage == 'undefined') {
            alert('Сохранение информации недоступно в вашем браузере.');
            return;
        }

        // Using JSON serialization for not losing types of values
        // because localStorage converts everything to strings.
        localStorage.setItem(key, JSON.stringify({ value: value }));
    },

    get: function (key) {
        var data = typeof localStorage != 'undefined' ? localStorage.getItem(key) : null;

        return data !== null ? JSON.parse(data).value : this._defaults[key];
    },

    clear: function (key) {
        if (typeof localStorage == 'undefined') {
            return;
        }

        localStorage.removeItem(key);
    }
});