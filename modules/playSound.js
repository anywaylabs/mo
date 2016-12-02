define(['./storage', './media', './env', './assets'], function (storage, media, env, assets) {

var lastPlayer = null;

return function (sound, callback) {
    if (lastPlayer) {
        media.clearPlayer(lastPlayer);
    }

    if (!storage.get('soundsEnabled')) {
        return;
    }

    if (env.browser.mozilla || (env.iOS && !env.phonegap)) {
        return;
    }

    if (sound) {
        var split = sound.split('.'),
            name = split[0],
            ext = split[1] || 'wav';

        lastPlayer = media.play(assets.getDir() + 'music/' + name + '.' + ext, 0.8, callback);
    }
}

});