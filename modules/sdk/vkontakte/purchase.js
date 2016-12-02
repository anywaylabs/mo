define(['vow', '../vkontakte/vendorSdk'], function (vow, vendorSdk) {
    var callbacksAdded = false,
        purchaseDeferred = null;

    function addCallbacks () {
        vendorSdk.promise().then(function (VK) {
            VK.addCallback('onOrderSuccess', function () {
                if (purchaseDeferred) {
                    purchaseDeferred.resolve();
                }
            });

            VK.addCallback('onOrderFail', function (err) {
                if (purchaseDeferred) {
                    purchaseDeferred.reject('Покупка не удалась. Ошибка #' + err);
                }
            });

            VK.addCallback('onOrderCancel', function () {
                if (purchaseDeferred) {
                    purchaseDeferred.reject('Покупка была отменена');
                }
            });
        });
    }

    return function (item) {
        if (!callbacksAdded) {
            addCallbacks();
        }

        return vendorSdk.promise().then(function (VK) {
            purchaseDeferred = vow.defer();

            VK.callMethod('showOrderBox', {
                type: 'item',
                item: item
            });

            return purchaseDeferred.promise();
        });
    }
});