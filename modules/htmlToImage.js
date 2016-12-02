define([
    'lodash', 'jquery', 'vow',
    './dataUrlToBlob'
], function (_, $, vow, dataUrlToBlob) {
    var html2canvasPromise = null;

    function htmlToImage (elements, params) {
        html2canvasPromise || (html2canvasPromise = promiseRequire());

        $('.ui-loader').attr('data-html2canvas-ignore', true);

        var single = false,
            commonParams = !_.isArray(params);

        if (!_.isArray(elements)) {
            elements = [elements];
            single = true;

            if (!commonParams) {
                params = [params];
            }
        }

        return html2canvasPromise.then(function (html2canvas) {
            return vow.all(_.map(elements, function (element, i) {
                return elementToBlobPromise(html2canvas, element, i, params, commonParams);
            }))
        }).then(function (blobs) {
            return single ? blobs[0] : blobs;
        });
    }

    function promiseRequire () {
        return new vow.Promise(function (resolve, reject) {
            require(['html2canvas'], function () {
                resolve(window['html2canvas']);
            }, function (err) {
                reject(err);
            });
        });
    }

    function elementToBlobPromise (html2canvas, element, i, params, commonParams) {
        var imageParams = (commonParams ? params : params[i]) || {},
            factor = !imageParams.skipX2 ? 2 : 1,
            crop = {
                x: imageParams.cropX ? imageParams.cropX * factor : 0,
                y: imageParams.cropY ? imageParams.cropY * factor : 0,
                width: imageParams.cropWidth ? imageParams.cropWidth * factor : null,
                height: imageParams.cropHeight ? imageParams.cropHeight * factor : null
            };

        !imageParams.skipX2 && $(element).addClass('html2canvas-x2');
        var toCanvasPromise = html2canvas(element, _.extend({ useCORS: true, background: '#333333' }, imageParams));
        !imageParams.skipX2 && $(element).removeClass('html2canvas-x2');

        return vow.resolve(toCanvasPromise)
            .then(function (canvas) {
                if ((crop.width && imageParams.width != crop.width) ||
                    (crop.height && canvas.width != crop.height) ||
                    crop.x || crop.y
                    ) {
                    var newCanvas = document.createElement('canvas'),
                        newCtx = newCanvas.getContext('2d');

                    newCanvas.width = crop.width || canvas.width;
                    newCanvas.height = crop.height || canvas.height;

                    newCtx.drawImage(canvas, crop.x, crop.y);

                    canvas = newCanvas;
                }

                var mimeType = imageParams.mimeType || 'image/png';

                return dataUrlToBlob(canvas.toDataURL(mimeType), mimeType);
            });
    }

    return htmlToImage;
});