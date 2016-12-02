define(['lodash', 'vow', '../../connect', '../vkontakte/api'], function (_, vow, connect, vkApi) {
    return function (files) {
        return vkApi('photos.getWallUploadServer')
            .then(function (serverResult) {
                var uploadPromises = _.map(files, function (file) {
                        return connect.push('/upload/vkontakte', {
                            upload_url: serverResult.upload_url,
                            file: file
                        }, null, true);
                    });

                return vow.all(uploadPromises);
            })
            .then(function (uploadResults) {
                var savePromises = _.map(uploadResults, function (uploadResult) {
                        return vkApi('photos.saveWallPhoto', uploadResult.result);
                    });

                return vow.all(savePromises);
            });
    }
});