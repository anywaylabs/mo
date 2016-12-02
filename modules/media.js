define(['jquery', 'lodash', './env', './assets'], function ($, _, env, assets) {

var html5Audio = {
        _$iframe: null,
        _iFrameReady: false,

        _getIFrame: function () {
            if (!html5Audio._$iframe) {
                html5Audio._$iframe = $('<iframe src="' + assets.getDir() + 'ios-player.html" width="0" height="0" frameborder="0">')
                    .appendTo(document.body)
                    .load(function () {
                        html5Audio._iFrameReady = true;
                    });
            }
            return html5Audio._$iframe;
        },

        play: function (src, volume, callback) {
            var $player = $('<audio>')
                .attr('src', src);

            $player[0].volume = volume || 0.5;

            $player.on('ended', function () {
                html5Audio.clearPlayer($player);
                callback && callback();
            });

            // context: parentElement (body or iframe)
            function appendAndPlay (parent) {
                $player.appendTo($(parent));
                $player[0].load();
                $player[0].play();
            }

            if (env.iOS) {
                var $iFrame = html5Audio._getIFrame();
                if (html5Audio._iFrameReady) {
                    appendAndPlay($iFrame);
                } else {
                    $iFrame.load(function () { appendAndPlay($iFrame); });
                }
            } else {
                appendAndPlay(document.body);
            }

            return $player;
        },

        clearPlayer: function ($player) {
            $player[0].pause();
            $player
//                    .trigger('ended')
                .off('ended')
                .remove();
            $player = null;
        }
    },

    phonegapMedia = {
        play: function (src, volume, callback) {
            var player = new Media(src, null, null, function (state) {
                if (state == 4) {
                    player.release();
                    callback && callback();
                }
            });

            // Obey mute button + keep calm in background.
            player.play({ playAudioWhenScreenIsLocked : false });

            return player;
        },

        clearPlayer: function (player) {
            player.release();
            player.stop();
        }
    },

    naMedia = {
        _na: null,

        init: function () {
            naMedia._na = window.plugins && window.plugins.NativeAudio;

            var sounds = ['award', 'draw', 'gameStart', 'intro', 'lost', 'pk', 'rightAnswer', 'timer', 'won', 'wrongAnswer'],
                music = ['app', 'game'];

            _.each(sounds, function (name) {
                var id = assets.getDir() + 'music/' + name + '.wav';

                naMedia._na.preloadSimple(id, id);
            });

            _.each(music, function (name) {
                var id = assets.getDir() + 'music/' + name + '.mp3';

                naMedia._na.preloadComplex(id, id, 1, 1, 0);
            });
        },

        play: function (src, volume, callback) {
            if (src.indexOf('.mp3') != -1) {
                naMedia._na.loop(src);
            } else {
                naMedia._na.play(src);
            }

            return src;
        },

        clearPlayer: function (player) {
            naMedia._na.stop(player);
        }
    },

    initProxy = {
        _media: null,

        init: function () {
            initProxy._media = env.phonegap ?
                (window.plugins && window.plugins.NativeAudio ? naMedia : phonegapMedia) :
                html5Audio;

            if (typeof initProxy._media.init == 'function') {
                return initProxy._media.init.apply(this, arguments);
            }
        },

        play: function () {
            return initProxy._media.play.apply(this, arguments);
        },

        clearPlayer: function () {
            return initProxy._media.clearPlayer.apply(this, arguments);
        }
    };

    return initProxy;
});