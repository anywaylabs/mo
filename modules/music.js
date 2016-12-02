define(['lodash', './storage', './media', './assets'], function (_, storage, media, assets) {
    var music = {};

    function init () {
        var tracks = [],
            currentPlayer = null,
            i = 0;

        music.setup = function (track) {
            tracks = [track || 'app'];
            music.playNext();
        };

        music.playNext = function () {
            if (!storage.get('musicEnabled')) {
                return;
            }

            var split = tracks[i].split('.'),
                name = split[0],
                ext = split[1] || 'mp3';

            currentPlayer = media.play(assets.getDir() + 'music/' + name + '.' + ext, 0.3, music.playNext);
            i = i < tracks.length - 1 ? i + 1 : 0;
        };

        music.clear = function () {
            if (currentPlayer) {
                media.clearPlayer(currentPlayer);
            }
        };
    }

    return {
        init: init,
        play: function (track) {
            music.clear();
            music.setup(track);
        },
        stop: function () { music.clear(); }
    }
});