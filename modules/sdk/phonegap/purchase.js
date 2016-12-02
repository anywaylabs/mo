define([
    'lodash', 'vow', 'config', '../../modal', '../../popup', '../../connect', '../../env', 'remote/singletons/storePrices'
], function (_, vow, config, modal, popup, connect, env, remoteStorePrices) {
    var STATUSES = {
            idle: 0,
            started: 10,
            purchased: 20,
            verified: 40,
            finished: 50,
            error: 60
        },
        ITEM_LOAD_TIMEOUT = 10000;

    var inited = false,
        purchaseDeferred = null,
        restoreDeferred = null,
        purchaseStatus = 0,
        loadedItems = [];

    function init () {
        if (!env.iOS) {
            return;
        }

        window.storekit.init({
            noAutoFinish: true,
            debug: config.debug,

            ready: function () {
                remoteStorePrices.getGoods().then(function (goods) {
                    var productIds = _.without(goods, 'category');

                    if (env.iOS) {
                        productIds = _.without(productIds, 'maecenas');
                        productIds.push('maecenas.2');
                    }

                    loadItems(productIds);
                });
            },

            purchase: function (transactionId, productId) {
                purchaseStatus = STATUSES.started;

                modal.show('info', 'Проверка покупки...');

                window.storekit.loadReceipts(function (receipts) {
                    var verify = connect.push('/store/purchase', {
                        platform: 'apple',
                        item: productId,
                        transaction_id: transactionId,
                        receipt: receipts.appStoreReceipt
                    }, null, true);

                    verify.always(function (promise) {
                        purchaseStatus = promise.isFulfilled() ? STATUSES.verified : STATUSES.error;

                        window.storekit.finish(transactionId);
                    });
                });
            },

            finish: function (transactionId, productId) {
                if (purchaseDeferred) {
                    if (purchaseStatus == STATUSES.verified) {
                        purchaseStatus = STATUSES.finished;

                        purchaseDeferred.resolve(productId);
                    } else {
                        purchaseDeferred.reject('Покупка была отменена');
                    }
                }
            },

            error: function (errCode, errtext) {
                if (purchaseDeferred) {
                    purchaseDeferred.reject('Покупка не удалась. Ошибка #' + errCode + ': ' + errtext);
                }
            },

//            restore: function (transactionId, productId) {
//                restoreDeferred.resolve();
//            },

            restoreFailed: function (errCode, errtext) {
                restoreDeferred.reject('Восстановление не удалось. Ошибка #' + errCode + ': ' + errtext);
            },

            restoreCompleted: function () {
                restoreDeferred.resolve();
            }
        });

        inited = true;
    }

    function purchase (item) {
        if (!inited) {

            return vow.reject();
        }

        if (item == 'restore') {
            return restore();
        }

        if (purchaseStatus != STATUSES.idle) {
            popup.show('Предыдущая транзакция все ещё выполняется...', { hideTimeout: false });
            return vow.reject();
        }

        if (env.iOS && item == 'maecenas') {
            item = 'maecenas.2';
        }

        modal.show('info', 'Пожалуйста, дождитесь завершения транзакции...');

        if (!_.contains(loadedItems, item)) {
            return loadItems([item]).then(function () {
                return purchase(item);
            });
        }

        purchaseStatus = STATUSES.started;
        purchaseDeferred = vow.defer();

        var promise = purchaseDeferred.promise();

        window.storekit.appStoreReceipt = null;
        window.storekit.purchase(item, 1);

        promise.always(function () {
            purchaseStatus = STATUSES.idle;
            modal.hide('info');
        });

        return promise;
    }

    function restore () {
        restoreDeferred = vow.defer();

        var promise = restoreDeferred.promise();

        modal.show('info', 'Пожалуйста, дождитесь завершения восстановления...');

        window.storekit.restore();

        promise.always(function () {
            modal.hide('info');
        });

        return promise;
    }

    function loadItems (items) {
        var deferred = vow.defer(),
            itemsToLoad = loadedItems.concat(items);

        window.storekit.load(itemsToLoad, function (validProducts, invalidProductIds) {
            loadedItems = _.pluck(validProducts, 'id');

            if (invalidProductIds.length) {
                deferred.reject(invalidProductIds);

                return;
            }

            deferred.resolve();
        });

        return deferred.promise().timeout(ITEM_LOAD_TIMEOUT);
    }

    return {
        init: init,
        purchase: purchase
    }
});