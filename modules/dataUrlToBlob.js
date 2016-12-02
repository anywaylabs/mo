define(function () {
    return function (dataUrl, mimeType) {
        mimeType || (mimeType = 'image/png');

        var blobBin = atob(dataUrl.split(',')[1]),
            array = [];

        for(var i = 0, l = blobBin.length; i < l; i++) {
            array.push(blobBin.charCodeAt(i));
        }

        return new Blob([new Uint8Array(array)], { type: mimeType });
    }
});