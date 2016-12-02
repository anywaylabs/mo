define([
    'jquery', 'vow',
    './popup', './loader',
    './env', './htmlToImage'
], function ($, vow, popup, loader, env, htmlToImage) {
    return function (elements, params) {
        var deferred = vow.defer();

        if (env.standalone) {
            navigator.screenshot.save(function (error,res) {
                if (error) {
                    deferred.reject(error);
                } else {
                    deferred.resolve(res.filePath);
                }
            });
        } else if (env.vkontakte) {
            popup.show('Создание изображений...');
            loader.show();

            htmlToImage(elements, params).then(function (image) {
                popup.hide();
                loader.hide();
                
                deferred.resolve(image);
            }, function () {
                deferred.reject();
            });
        } else {
            deferred.reject();
        }

        return deferred.promise();
    }
});
