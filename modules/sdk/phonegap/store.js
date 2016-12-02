define([
    'lodash', 'vow', 'config', '../../modal', '../../popup', '../../connect', '../../env', 'remote/singletons/storePrices'
], function (_, vow, config, modal, popup, connect, env, remoteStorePrices) {
    var ITEM_LOAD_TIMEOUT = 10000;

    var inited = false,
        purchaseDeferred = null,
        fetchPromises = {};

    function init () {
        if (!env.phonegap || typeof store != 'object') {
            return;
        }

        store.verbosity = store.INFO;
        store.validator = validate;

        store.when('product').approved(function (product) {
            purchaseDeferred && product.verify();
        });

        store.when('product').verified(function (product) {
            purchaseDeferred && product.finish();
        });

        store.when('product').owned(function () {
            purchaseDeferred && purchaseDeferred.resolve();
        });

        store.when('product').cancelled(function () {
            purchaseDeferred && purchaseDeferred.reject('cancelled');
        });

        store.when('product').error(function () {
            purchaseDeferred && purchaseDeferred.reject('error');
        });

        store.when('product').unverified(function () {
            purchaseDeferred && purchaseDeferred.reject('unverified');
        });

        store.error(function (err) {
            purchaseDeferred && purchaseDeferred.reject(err);
        });

        inited = true;
    }

    function purchase (item) {
        if (!inited) {
            return;
        }

        if (item == 'restore') {
            store.refresh();
            return vow.resolve();
        }

        if (purchaseDeferred) {
            popup.show('Предыдущая транзакция все ещё выполняется...', { hideTimeout: false });
            return vow.reject('processing previous');
        }

        if (env.iOS && item == 'maecenas') {
            item = 'maecenas.2';
        }
        
        purchaseDeferred = vow.defer();

        var promise = purchaseDeferred.promise();

        modal.show('info', 'Пожалуйста, дождитесь завершения транзакции...');

        fetch(item, true).then(function (product) {
            if (!product.canPurchase) {
                purchaseDeferred.reject('can not purchase product');
                return;
            }
                
            store.order(product);
        }, function (err) {
            purchaseDeferred.reject(err || 'product not registered');
        });

        promise.always(function () {
            if (promise.isRejected()) {
                popup.show({ error: 'Покупка не удалась' });
            }

            purchaseDeferred = null;
            modal.hide('info');
        });

        return promise;
    }

    function fetch (item, refreshNeeded) {
        if (!fetchPromises[item]) {
            var deferred = vow.defer();

            store.once(item).valid(function (product) { deferred.resolve(product); });
            store.once(item).error(function (err) { deferred.reject(err); });

            store.register({
                id: item,
                type: store.NON_CONSUMABLE
            });

            if (refreshNeeded === true) {
                store.refresh();
            }
            
            fetchPromises[item] = deferred.promise().timeout(ITEM_LOAD_TIMEOUT);
        }
        
        return fetchPromises[item];
    }
    
    function validate (product, cb) {
        var transaction = product.transaction,
            platforms = { 'ios-appstore': 'apple', 'android-playstore': 'android' };

        connect.push('/store/purchase', {
            platform: platforms[transaction.type],
            item: product.id,
            transaction_id: transaction.id,
            receipt: transaction.transactionReceipt
        }, null, true)
            .timeout(5000)
            .always(function (promise) {
                cb(promise.isFulfilled(), promise.valueOf());
            });
    }

    return {
        init: init,
        purchase: purchase
    }
});