define([
    'lodash', 'vow',
    'config',
    '../../connect',
    '../vkontakte/api',
    '../vkontakte/wallImagesUpload'
], function (_, vow, config, connect, vkApi, wallImagesUpload) {
    function wallPost (params) {
        return upload(params.photos).always(function (uploadPromises) {
            var promiseValue = uploadPromises.valueOf(),
                photos = uploadPromises.isFulfilled() && promiseValue,
                postParams = {
                    message: fetchVars(params.message) + ' ' + getTags(),
                    attachments: params.attachments
                };

            if (photos) {
                postParams.attachments = composeAttachments(_.map(photos, function (p) { return p[0]; }));
            }

            if (params.photos && uploadPromises.isRejected()) {
                connect.push('/info/report_error', {
                    message: 'VK wall post images were not uploaded',
                    original_error: JSON.stringify(promiseValue || {}),
                    original_error_message: promiseValue && promiseValue.message
                });

                postParams.attachments = '$$icon';
            }

            if (postParams.attachments == '$$icon') {
                postParams.attachments = 'photo-78444785_353987929';
            }

            return vkApi('wall.post', postParams);
        });
    }

    function fetchVars (message) {
        return message.replace(/\$\$appLink\((.+?)\)/g, '@mozggame ($1) — https://vk.com/play.mozg');
    }

    function getTags () {
        return _.shuffle(config.share_tags.split(' ')).join(' ');
    }

    function upload (photos) {
        if (!photos) {
            return vow.resolve(null);
        }

        return wallImagesUpload(photos);
    }

    function composeAttachments (attachments) {
        return _.map(attachments, function (object) {
            return 'photo' + object.owner_id + '_' + object.id;
        }).join(',');
    }

    return wallPost;
});